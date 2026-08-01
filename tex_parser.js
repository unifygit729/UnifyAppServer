const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function parseTex(filePath) {
    const tempMd = path.join(path.dirname(filePath), 'temp_conv.md');
    try {
        // Run Pandoc with specific extensions to preserve math as much as possible
        // --wrap=none prevents pandoc from inserting line breaks mid-sentence
        execSync(`pandoc "${filePath}" -o "${tempMd}" -t markdown-smart-simple_tables-multiline_tables-grid_tables --wrap=none`);
        let mdText = fs.readFileSync(tempMd, 'utf8');
        fs.unlinkSync(tempMd);

        // Split by Answer Key to ignore it in questions
        const answerKeySplit = mdText.split(/#+\s*Answer Key|Answer Key\s*\n={3,}/i);
        let questionSection = answerKeySplit[0];

        // Split into individual questions. 
        // Look for "1. ", "2. ", etc at the start of a line.
        const parts = questionSection.split(/\n\s*(?=\d+\.\s)/);
        
        const questions = [];
        parts.forEach(p => {
            let text = p.trim();
            if (!text || !/^\d+\./.test(text)) return;

            // Preserve LaTeX math blocks. Pandoc usually puts them in $$ or $
            // We want to ensure they are compatible with MathJax.
            // Inline math: $...$ -> \(...\)
            // Block math: $$...$$ -> \[...\]
            text = text.replace(/\$\$(.*?)\$\$/gs, (match, p1) => `\\[${p1.trim()}\\]`);
            text = text.replace(/\$(.*?)\$/g, (match, p1) => `\\(${p1.trim()}\\)`);

            let qText = text;
            let options = ['Option A', 'Option B', 'Option C', 'Option D'];

            // Find options. They usually look like "A. ... B. ... C. ... D. ..." or "(a) ... (b) ..."
            // We'll look for markers at the end of the question.
            const optMarkers = /\n\s*(?:[A-D]\.\s+|\([a-d]\)\s+|\d\.\s+)/g;
            const splitMatch = text.match(optMarkers);

            if (splitMatch && splitMatch.length >= 2) {
                const firstOptIndex = text.search(optMarkers);
                if (firstOptIndex !== -1) {
                    qText = text.substring(0, firstOptIndex).trim();
                    let optionsText = text.substring(firstOptIndex);
                    
                    let extractedOpts = optionsText.split(optMarkers).filter(o => o.trim().length > 0);
                    if (extractedOpts.length > 0) {
                        options = extractedOpts.map(o => o.trim()).slice(0, 4);
                        while(options.length < 4) options.push("N/A");
                    }
                }
            }

            // Clean up the question text for responsive HTML
            // Remove the leading number "1. "
            qText = qText.replace(/^\d+\.\s+/, '');
            // Convert double newlines to breaks for paragraphs, single newlines to spaces for flow
            qText = qText.replace(/\n\n/g, '<br><br>').replace(/\n/g, ' ');

            questions.push({ q: qText, options });
        });

        // Extract Answer Key from original TeX (most reliable source)
        const texText = fs.readFileSync(filePath, 'utf8');
        const ansMatch = texText.match(/\\section\*?\{Answer Key\}(.*?)(?:\\section\*?\{Solutions\}|\\end\{document\})/is);
        const answerKey = [];
        if (ansMatch) {
            const items = ansMatch[1].match(/\\item\s+([A-D])/gi);
            if (items) {
                items.forEach(item => {
                    const char = item.split(/\s+/)[1].toUpperCase();
                    answerKey.push(char.charCodeAt(0) - 65);
                });
            }
        }

        return { questions, answerKey };
    } catch (err) {
        console.error("Parse Error:", err);
        return null;
    }
}

module.exports = { parseTex };
