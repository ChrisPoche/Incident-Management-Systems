let templateStore = {};

const resizeTextArea = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
}

const addHighlightsToEditable = () => {
    let template = document.getElementsByTagName('table')[0];
    let spans = [...template.querySelectorAll('span')].filter(s => s.innerHTML.indexOf('[') !== -1);
    for (let i = 1; i < spans.length; i++) {
        spans[i].classList.add('edit-highlight');
        spans[i].addEventListener('click', (e) => {
            e.stopPropagation();
            let currentFocus;
            let surroundingText = spans[i].innerHTML.substr(0, spans[i].innerHTML.indexOf('['));
            let classes = [...e.target.classList];
            console.log(classes);
            if (classes.length > 1) {
                currentFocus = classes.filter(c => c !== 'edit-highlight')[0];
                console.log('already clicked on this', currentFocus);
            }
            else if (surroundingText === 'The next update on this issue will come no later than ') {
                spans[i].classList.add('nextUpdateString');
                currentFocus = 'nextUpdateString';
                console.log('First time clicking on next update string');
            }
            else if (surroundingText === '') {
                spans[i].classList.add('currentUpdateText');
                currentFocus = 'currentUpdateText';
                console.log('First time clicking on current update text');
            }

            let input = currentFocus === 'currentUpdateText' ? document.createElement('textarea') : document.createElement('input');
            input.id = 'active-input';
            input.classList.add('inline-edit');
            let placeholder = spans[i].innerHTML.substr(spans[i].innerHTML.indexOf('['));
            input.placeholder = placeholder;
            spans[i].innerHTML = currentFocus === 'nextUpdateString' ? 'The next update on this issue will come no later than ' : '';
            input.value = templateStore[currentFocus] ? templateStore[currentFocus].replace(/<br>/g, '\n') : '';

            spans[i].appendChild(input);
            document.getElementById('active-input').addEventListener('focus', resizeTextArea);
            spans[i].classList.remove('edit-highlight');
            document.getElementById('active-input').focus();

            document.getElementById('active-input').addEventListener('keyup', resizeTextArea);

            input.addEventListener('blur', (e) => {
                let value = !!e.target.value.match(/[.,:!?]$/) ? e.target.value.substr(0, e.target.value.length - 1).trim() : e.target.value.trim();
                if (value.length === 0) {
                    spans[i].innerHTML += currentFocus === 'nextUpdateString' ? '[H:MM AM/PM]' : "[The next update's text goes here...]";
                    templateStore[currentFocus] = null;
                }
                else if (value.length > 0) {
                    console.log(value);
                    value = value.replace(/[\n\r]/g, '<br>');
                    spans[i].innerHTML += value + '.';
                    templateStore[currentFocus] = value;
                }
                spans[i].classList.add('edit-highlight');
                document.getElementById('active-input').remove();
            })
        });
    }
}

const createFormInput = () => {
    let formWrapper = document.createElement('form');
    formWrapper.id = 'form-inputs';
    let textArea = document.createElement('textarea');
    textArea.id = 'textArea';
    textArea.placeholder = 'Copy / Paste the entire last update email here';
    formWrapper.appendChild(textArea);
    document.getElementById('left-column').appendChild(formWrapper);
    addListernerToTextarea();
}

const addTemplateToDOM = () => {
    let partial = "<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 style='border-collapse:collapse;mso-yfti-tbllook:1184;mso-padding-alt:0in 0in 0in 0in'> <tr style='mso-yfti-irow:0;mso-yfti-firstrow:yes'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><b><span style='font-size:18.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[STATUS] – [P#] – [Account Name]</span></b> <o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:18.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[Major Incident Subject]</span> <o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:18.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[m/d/yyyy HH:MM AM/PM]</span> <o:p></o:p> </p> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:1'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;background:#F8981D;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif; color:white'>Client Impact</span> <o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:2'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='margin-left:.5in;line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal style='line-height:105%'><span style='font-family: \"Arial\",sans-serif'>[The Client/internal team has reported that...]<br> <br> <i><span style='color:red'>`You can put highlight text or errors by encapsulating the text with backticks`</span></i> <o:p></o:p> </span></p> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:3'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;background:#00A5DB;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif; color:white'>Resources</span> <o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:4'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='line-height:10%'><span style='font-family:\"Arial\",sans-serif'>&nbsp; <o:p></o:p> </span></p> <p class=xxxxmsonormal style='line-height:105%'><b><span style='font-size: 12.0pt;line-height:105%;font-family:\"Arial\",sans-serif;color:black'>Salesforce Ticket:&nbsp;</span></b><span style='font-family:\"Arial\",sans-serif'><a>[01234567]</a> <o:p></o:p> </span></p> <p class=xxxxmsonormal style='line-height:105%'><b><span style='font-family: \"Arial\",sans-serif'>Jira Ticket: </span></b><span style='font-family:\"Arial\",sans-serif'><a target=\"_blank\">[REL-123456]</a> <o:p></o:p> </span></p> <p class=xxxxmsonormal style='line-height:105%'><b><span style='font-family: \"Arial\",sans-serif'>Slack Channel: </span></b><span style='font-family:\"Arial\",sans-serif'><a target=\"_blank\">#[p2-01234567-acount-name]</a> <o:p></o:p> </span></p> <p class=xxxxmsonormal style='line-height:105%'><b><span style='font-family: \"Arial\",sans-serif'>Caused by CR: </span></b><span style='font-family:\"Arial\",sans-serif'>[Yes/No]<o:p></o:p></span> </p> <p class=xxxxmsolistparagraph style='line-height:10%'><span style='font-family: \"Arial\",sans-serif'>&nbsp;<o:p></o:p></span></p> </td> </tr> <tr style='mso-yfti-irow:5'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;background:#666666;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif; color:white'>Current &amp; Prior Update</span> <o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:6'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><b><span style='font-size:14.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[Today's Date: mmm d, yyyy]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><b><span style='font-size:12.0pt;font-family: \"Arial\",sans-serif'>[H:MM AM/PM]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><span style='font-family:\"Arial\",sans-serif'>[This is where the current update will go...]</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='line-height:105%'><span style='font-family:\"Arial\",sans-serif'>The next update on this issue will come no later than [H:MM AM/PM].</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><b><span style='font-size:14.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[Last Update Date: mmm d, yyyy]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><b><span style='font-size:12.0pt;font-family: \"Arial\",sans-serif'>[H:MM AM/PM]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><span style='font-family:\"Arial\",sans-serif'>[This is where you'll see the last update]</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='line-height:10%'>&nbsp;<o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:7'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;background:#F8981D;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif; color:white'>Incident Response Team</span> <o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:8'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal style='line-height:75%'><b><span style='font-family: \"Arial\",sans-serif'>Support</span></b> <o:p></o:p> </p> </p> <p class=xxxxmsonormal style='line-height:75%'><b><span style='font-family: \"Arial\",sans-serif'>[You'll add involved teams here]</span></b> <o:p></o:p> </p> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:9'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;background:#00A5DB;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif; color:white'>Previous Updates</span> <o:p></o:p> </p> </td> </tr> <tr style='mso-yfti-irow:10;mso-yfti-lastrow:yes'> <td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt; border-top:none;padding:0in 5.4pt 0in 5.4pt'> <p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsonormal align=center style='text-align:center;line-height: 105%'><b><span style='font-size:14.0pt;line-height:105%;font-family:\"Arial\",sans-serif'>[Previous Update Date: mmm d, yyyy]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><b><span style='font-size:12.0pt;font-family: \"Arial\",sans-serif'>[H:MM AM/PM]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><span style='font-family:\"Arial\",sans-serif'>[You'll see all previous updates to the last one below]</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='line-height:10%'>&nbsp;<o:p></o:p> </p> <p class=xxxxmsolistparagraph><b><span style='font-size:12.0pt;font-family: \"Arial\",sans-serif'>[H:MM AM/PM]</span></b> <o:p></o:p> </p> <p class=xxxxmsolistparagraph><span style='font-family:\"Arial\",sans-serif'>This message is to inform you of a new [P#] incident which has been initiated for [Account Name].</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='margin-bottom:12.0pt'><span style='font-family:\"Arial\",sans-serif'>[This is the first update]</span> <o:p></o:p> </p> <p class=xxxxmsolistparagraph style='line-height:10%'>&nbsp;<o:p></o:p> </p> </td> </tr> </table>"
    let template = document.getElementById('right-column');
    // Populate template from partial
    template.innerHTML = partial;
    // Remove the scroll bar from field of view for template
    template.style.paddingRight = `${template.offsetWidth - template.clientWidth + 10}px`;
    template.style.right = `-${template.offsetWidth - template.clientWidth}px`;
    // addHighlightsToEditable();
}

const parseFile = (file) => {
    window.api.send('toRead', file[0].path);
    window.api.receive('fromRead', (str) => {
        modifyTable(str[0]);
    })
    document.getElementById('drag-n-drop').remove();
    document.getElementById('textArea').remove();
};

const createDragAndDropArea = () => {
    let dragAndDrop = document.createElement('div');
    dragAndDrop.id = 'drag-n-drop';
    let template = document.getElementById('right-column');
    dragAndDrop.style.right = `${template.offsetWidth - template.clientWidth}px`;
    dragAndDrop.style.width = `${template.clientWidth - (template.offsetWidth - template.clientWidth) + 2}px`;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(et => {
        dragAndDrop.addEventListener(et, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    ['dragenter', 'dragover'].forEach(et => {
        dragAndDrop.addEventListener(et, () => {
            dragAndDrop.classList.add('highlight');
            template.classList.add('no-pointer');
        });
    });
    ['dragleave', 'drop'].forEach(et => {
        dragAndDrop.addEventListener(et, () => {
            dragAndDrop.classList.remove('highlight');
            template.classList.remove('no-pointer');
        });
    });
    dragAndDrop.addEventListener('drop', (e) => {
        addTemplateToDOM();
        let dataTransfer = e.dataTransfer;
        let file = dataTransfer.files;
        parseFile(file);
    });
    document.getElementById('main-process').appendChild(dragAndDrop);
    // Hide drag and drop area to allow template to be scrolled
    dragAndDrop.addEventListener('mouseenter', () => {
        dragAndDrop.classList.add('hidden')
    })
    template.addEventListener('mouseleave', () => {
        dragAndDrop.classList.remove('hidden')
    })
}



const modifyTable = (html) => {
    let table = html.substring(html.indexOf('<table'), html.indexOf('</table') + 8);
    if (table.indexOf('<table') !== -1) {

        // Grab values and concat subject
        let header = table.substring(table.indexOf('<span')).substring(table.substring(table.indexOf('<span')).indexOf('>') + 1, table.substring(table.indexOf('<span')).indexOf('</span>')).split(' – ').map(s => s.trim());
        let status = `(${header[0]})`;
        let priority = header[1];
        let ticketNumber = table.substring(table.indexOf('<a')).substring(table.substring(table.indexOf('<a')).indexOf('>') + 1, table.substring(table.indexOf('<a')).indexOf('</a>'));
        let account = header[2];
        // Build subject after download button is clicked below
 
        // Move down Current Update
        let sections = table.split('<tr');
        let focusSection = 'Current ';
        const findCurrentUpdate = (e) => e.indexOf(focusSection) !== -1;
        let csTableRow = sections.findIndex(findCurrentUpdate) + 1;
        let currentUpdateSection = sections[csTableRow]
        let csLines = currentUpdateSection.split('<span');
        let currentDateString = csLines[1].substring(csLines[1].indexOf('>') + 1).substring(0, csLines[1].substring(csLines[1].indexOf('>') + 1).indexOf('</span>'));
        let currentUpdateDate = new Date(currentDateString);
        let now = new Date();
        // Format Now Date for template
        let options = { month: 'long', day: 'numeric', year: 'numeric' };
        let nowDateString = now.toLocaleDateString('en-US', options);

        let currentDateCheck = currentUpdateDate.getMonth() + '/' + currentUpdateDate.getDate() + '/' + currentUpdateDate.getFullYear();
        let nowDateCheck = now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear();

        // Inserting 4 indexes before Current Update for Next Update - date, time, content, cadence
        csLines.splice(1, 0, csLines[1].replace(currentDateString, nowDateString));
        csLines.splice(2, 0, csLines[3].replace(csLines[3].substring(csLines[3].indexOf('>') + 1).substring(0, csLines[3].substring(csLines[3].indexOf('>') + 1).indexOf('</span>')), '[H:MM AM/PM]'));
        // Checks if rows are out of alignment on Suspended Communication
        csLines[5].indexOf('<b>') === -1 ? csLines.splice(3, 0, csLines[5].replace(csLines[5].substring(csLines[5].indexOf('>') + 1).substring(0, csLines[5].substring(csLines[5].indexOf('>') + 1).indexOf('</span>')), "[The next update's text goes here...]")) : csLines.splice(3, 0, csLines[4].replace(csLines[4].substring(csLines[4].indexOf('>') + 1).substring(0, csLines[4].substring(csLines[4].indexOf('>') + 1).indexOf('</span>')), "[The next update's text goes here...]"));
        csLines[7].indexOf('14.0pt') === -1 ? csLines.splice(4, 0, csLines[7].replace(csLines[7].substring(csLines[7].indexOf('>') + 1).substring(0, csLines[7].substring(csLines[7].indexOf('>') + 1).indexOf('</span>')), 'The next update on this issue will come no later than [H:MM AM/PM]')) : csLines.splice(4, 0, csLines[5].replace(csLines[5].substring(csLines[5].indexOf('>') + 1).substring(0, csLines[5].substring(csLines[5].indexOf('>') + 1).indexOf('</span>')), 'The next update on this issue will come no later than [H:MM AM/PM]'));


        if (status !== '(STARTED)' && status !== '(STARTED/RESOLVED)') {
            if (status.indexOf('RESOLVED') === -1) csLines[7] = csLines[7].substring(0, csLines[7].indexOf('<p')) + csLines[csLines.length - 1].substring(csLines[csLines.length - 1].indexOf('<p'));
            // Grab 3 elements from Prior Update to move to Previous Updates Section 
            let prevDate = csLines[csLines.length - 3];
            let prevTime = csLines[csLines.length - 2];
            let startedBoilerplate = false;
            let resolvedBoilerplate = false;
            // Indication of Started email from New Incident boilerplate - need to push all rows down one with addition of boilerplate
            if (prevTime.indexOf('inform you of a new') !== -1 || prevTime.indexOf('Please consider this incident') !== -1) {
                prevDate = csLines[csLines.length - 4];
                prevTime = csLines[csLines.length - 3];
                if (prevTime.indexOf('inform you of a new') !== -1) startedBoilerplate = csLines[csLines.length - 2];
                if (prevDate.indexOf(' Root Cause Analysis') !== -1) {
                    prevDate = currentUpdateDate.toLocaleDateString('en-US', options);
                }
                if (prevTime.indexOf('Please consider this incident') !== -1) resolvedBoilerplate = csLines[csLines.length - 2]
            }
            let prevContent = csLines[csLines.length - 1].substring(0, csLines[csLines.length - 1].indexOf('</td>'));

            let prevUpdateFirstRow;
            // Prev Update is Started
            if (status === '(RESOLVED)') {
                const findNextUpdateTime = (e) => e.indexOf('come no later than') !== -1;
                let nextUpdateTimeRow = csLines.findIndex(findNextUpdateTime) + 1;

                prevUpdateFirstRow = csLines[nextUpdateTimeRow + 2].indexOf('Please consider this incident') !== -1 ? nextUpdateTimeRow + 5 : nextUpdateTimeRow + 6;

                if (csLines[prevUpdateFirstRow + 1].indexOf('inform you of a new') !== -1) {
                    prevDate = csLines[5];
                    prevTime = csLines[prevUpdateFirstRow];
                    startedBoilerplate = csLines[prevUpdateFirstRow + 1];
                    prevContent = csLines[prevUpdateFirstRow + 2];
                }
                if (csLines[csLines.length - 2].indexOf('inform you of a new') !== -1) {
                    prevTime = csLines[prevUpdateFirstRow + 1];
                    startedBoilerplate = csLines[prevUpdateFirstRow + 2];
                    prevContent = csLines[prevUpdateFirstRow + 3];
                    csLines.pop();
                }
            }

            // Remove last 3-4 - next update time boilerplate (Current) and previous update's date, time and content
            csLines.pop(); csLines.pop(); csLines.pop();
            // If second date is the same as today, there won't be a date header, and only 3 rows need to be popped, this checks whether the Next Update Time boilerplate exists
            if (csLines[csLines.length - 2].indexOf('come no later than') !== -1) {
                csLines.pop();
                csLines.pop();
            }
            if (csLines[csLines.length - 1].indexOf('come no later than') !== -1) {
                csLines.pop();
            }
            if (currentDateCheck !== nowDateCheck) {
                // Check that format to center date exists in Next Update Time 
                if (csLines[4].indexOf('align' === -1)) {
                    csLines[4] = csLines[4].replace(csLines[4].substring(csLines[4].indexOf('<p')), "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsonormal align=center style='text-align:center;line-height:105%'><b>");
                }
            }
            // If dates are the same, remove second date value
            if (currentDateCheck === nowDateCheck) {
                csLines.splice(5, 1);
                // Check if format to center exists, and remove it
                if (csLines[4].indexOf('align' !== -1)) {
                    csLines[4] = csLines[4].replace(csLines[4].substring(csLines[4].indexOf('<p')), "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsolistparagraph><b>");
                }
            }
            // Add closing tags for table data (td) and row (tr) to ensure there is no broken formating
            csLines[csLines.length - 1] = csLines[csLines.length - 1] + '</td></tr>';

            // Previous Section
            const findPrevUpdate = (e) => e.indexOf('Previous Update') !== -1;
            let psTableRow = sections.findIndex(findPrevUpdate) + 1;
            if (sections.findIndex(findPrevUpdate) === -1) {
                sections[sections.length - 1] = sections[sections.length - 1].replace('</table>', '');
                sections.push(" style='mso-yfti-irow:9'><td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt;border-top:none;background:#00A5DB;padding:0in 5.4pt 0in 5.4pt'><p class=xxxxmsonormal align=center style='text-align:center;line-height:105%'><span style='font-size:16.0pt;line-height:105%;font-family:\"Arial\",sans-serif;color:white'>Previous Updates</span><o:p></o:p></p></td></tr>")
                sections.push(" style='mso-yfti-irow:10;mso-yfti-lastrow:yes'><td width=623 valign=top style='width:467.5pt;border:solid windowtext 1.0pt;border-top:none;padding:0in 5.4pt 0in 5.4pt'><p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsonormal align=center style='text-align:center;line-height:105%'><b>")
                psTableRow = sections.findIndex(findPrevUpdate) + 1;
            }
            let prevUpdateSection = sections[psTableRow]
            let psLines = prevUpdateSection.split('<span');
            if (prevDate.indexOf('come no later than') !== -1) {
                prevDate = csLines[1].replace(nowDateString, currentDateString);
            }
            if (psLines[1] !== undefined) {
                let firstPrevDateString = psLines[1].substring(psLines[1].indexOf('>') + 1).substring(0, psLines[1].substring(psLines[1].indexOf('>') + 1).indexOf('</span>'));
                let firstPrevUpdateDate = new Date(firstPrevDateString);
                let prevUpdateDate = new Date(prevDate.substring(prevDate.indexOf('>') + 1).substring(0, prevDate.substring(prevDate.indexOf('>') + 1).indexOf('</span>')));

                // Inserting 3 indexes before first Prev Update
                psLines.splice(1, 0, prevDate);
                psLines.splice(2, 0, prevTime);
                if (resolvedBoilerplate) psLines.push(resolvedBoilerplate);
                psLines.splice(3, 0, prevContent);

                // If dates are the same, remove second date value
                let firstPrevDateCheck = firstPrevUpdateDate.getMonth() + '/' + firstPrevUpdateDate.getDate() + '/' + firstPrevUpdateDate.getFullYear();
                let prevDateCheck = prevUpdateDate.getMonth() + '/' + prevUpdateDate.getDate() + '/' + prevUpdateDate.getFullYear();

                if (prevDateCheck !== firstPrevDateCheck) {
                    psLines[3] = psLines[3].replace(psLines[3].substring(psLines[3].indexOf('<p')), "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsonormal align=center style='text-align:center;line-height:105%'><b>");
                }
                if (prevDateCheck === firstPrevDateCheck) {
                    psLines[3] = psLines[3] + psLines[4].substring(psLines[4].indexOf('<p'));
                    psLines.splice(4, 1);
                }
            }
            else if (psLines[1] === undefined) {
                psLines.push(prevDate);
                psLines.push(prevTime);
                if (startedBoilerplate) psLines.push(startedBoilerplate);
                if (resolvedBoilerplate) psLines.push(resolvedBoilerplate);
                psLines.push(prevContent + '</td></tr></table>');
            }

            // Rebuild table
            sections.splice(psTableRow, 1, psLines.join('<span'));
        }
        if (status === '(STARTED)' || status === '(STARTED/RESOLVED)') {
            if (currentDateCheck !== nowDateCheck) {
                // Check that format to center date exists in Next Update Time 
                if (csLines[4].indexOf('align' === -1)) {
                    csLines[4] = csLines[4].replace(csLines[4].substring(csLines[4].indexOf('<p')), "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsonormal align=center style='text-align:center;line-height:105%'><b>");
                }
            }
            // If dates are the same, remove second date value
            if (currentDateCheck === nowDateCheck) {
                csLines.splice(5, 1);
                // Check if format to center exists, and remove it
                if (csLines[4].indexOf('align' !== -1)) {
                    csLines[4] = csLines[4].replace(csLines[4].substring(csLines[4].indexOf('<p')), "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p><p class=xxxxmsolistparagraph><b>");
                }
            }
            if (csLines[csLines.length - 1].indexOf('come no later than') !== -1) {
                csLines.pop();
            }
            csLines[csLines.length - 1] = csLines[csLines.length - 1].substr(0, csLines[csLines.length - 1].indexOf('<p')) + "<p class=xxxxmsonormal style='line-height:10%'>&nbsp;<o:p></o:p></p>";
        };
        sections.splice(csTableRow, 1, csLines.join('<span'));
        table = sections.join('<tr');

        let downloadBTN;
        if (table.indexOf('<table') !== -1 && table.indexOf('<script') === -1) {
            // Replace template with table
            let template = document.getElementById('right-column');
            template.innerHTML = table;

            // Add drop menu for Status
            let headerNode = document.getElementById('right-column').querySelector('span');
            headerNode.innerHTML = "<span id='status-text'>" + header[0] + "</span>" + headerNode.innerHTML.substring(header[0].length);
            let statusOptions = ['Started', 'Ongoing', 'Resolved', 'Started/Resolved', 'Reopen', 'Suspend Communication']
            let dropdown = document.createElement('select');
            dropdown.id = 'status-dropdown';
            statusOptions.forEach(status => {
                let option = document.createElement('option');
                option.value = status.toUpperCase();
                option.label = status.toUpperCase();
                dropdown.appendChild(option);
            })
            document.getElementById('status-text').innerText = '';
            console.log(header[0])
            switch (header[0]) {
                case 'STARTED':
                    dropdown.value = 'ONGOING';
                    break;
                case 'ONGOING':
                    dropdown.value = 'ONGOING';
                    break;
                case 'STARTED/RESOLVED':
                    dropdown.value = 'REOPEN';
                    break;
                case 'SUSPENDED COMMUNICATION':
                    dropdown.value = 'REOPEN';
                    break;
                case 'RESOLVED':
                    dropdown.value = 'REOPEN';
                    break;
                default:
                    dropdown.value = 'STARTED';
                    break;
            }
            document.getElementById('status-text').appendChild(dropdown);
            let selectWidth = {
                STARTED: 112,
                ONGOING: 118,
                RESOLVED: 130,
                STARTEDRESOLVED: 249,
                REOPEN: 102,
                SUSPENDCOMMUNICATION: 330
            }
            let select = document.getElementById('status-dropdown');
            select.style.width = selectWidth[dropdown.value.replace('/', '').replace(' ', '')] + 'px';
            // Fix styling offset caused by highlight border
            select.addEventListener('mouseover', (e) => select.style.width = (selectWidth[dropdown.value.replace('/', '').replace(' ', '')] + 4) + 'px');
            select.addEventListener('mouseleave', (e) => select.style.width = selectWidth[dropdown.value.replace('/', '').replace(' ', '')] + 'px');
            // Change select width to match length of text
            select.addEventListener('change', (e) => {
                e.target.style.width = selectWidth[e.target.value.replace('/', '').replace(' ', '')] + 'px';
                if (e.target.value === 'RESOLVED') {
                    let pNode = document.getElementsByClassName('edit-highlight')[0].parentNode;
                    let cloneEL = pNode.cloneNode(true);
                    cloneEL.id = 'resolved-boilerplate';
                    cloneEL.firstChild.classList.remove('edit-highlight');
                    cloneEL.firstChild.innerText = 'Please consider this incident resolved.';
                    pNode.parentNode.insertBefore(cloneEL,pNode);
                };
                if (e.target.value !== 'RESOLVED' && document.getElementById('resolved-boilerplate')) {
                    document.getElementById('resolved-boilerplate').remove();
                }
            });

            // Download Button Actions
            downloadBTN = document.createElement('button');
            downloadBTN.textContent = 'Download EML';
            downloadBTN.id = 'download-button';
            downloadBTN.style.visibility = 'visible';
            downloadBTN.addEventListener('click', (e) => {
                document.getElementById('download-button').remove();
                let time = new Date();
                let timeSubmitted = new Date(Math.round(time.getTime() / (1000 * 60 * 5)) * (1000 * 60 * 5)).toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago' });
                let updateTime = [...template.querySelectorAll('span')].filter(s => s.innerHTML.indexOf('[') !== -1)[0];
                updateTime.innerHTML = timeSubmitted;
                let headerStatus = document.getElementById('status-dropdown').value;
                document.getElementById('status-text').innerHTML = headerStatus;
                let emailBody = document.getElementById('right-column').innerHTML;
                status = `(${headerStatus})`;                
                let subject = `${status} - ${priority} - ${ticketNumber} - ${account}`;
                let email = {
                    to: configEmailTo || 'test@test.com', // configEmailTo is variable from config.js which is included in the .gitignore file
                    subject,
                    body: '<html><body>' + emailBody + '</body></html>'
                }

                let emailText = 'To: ' + email.to + '\n';
                emailText += 'Subject: ' + email.subject + '\n';
                emailText += 'X-Unsent: 1' + '\n';
                emailText += 'Content-Type: text/html; charset="UTF-8"' + '\n';
                emailText += '' + '\n';
                emailText += email.body;

                window.api.send('toMain', emailText);

                window.api.receive("fromMain", (data) => {
                    let time = new Date();
                    if (data[0] === 'write complete') {
                        let a = document.createElement('a');
                        //a.href = '../template.eml'; // local test link
                        a.href = '../../../template.eml'; // desktop app link
                        a.id = 'file-link';
                        a.download = subject.replace(/\s/g, '') + '_' + time.getHours() + '_' + time.getMinutes() + '_' + time.getSeconds() + '.eml';
                        a.style.visibility = 'hidden';
                        document.body.appendChild(a);
                        document.getElementById('file-link').click();
                    }
                });
                location.reload();
            }, { once: true });
            addHighlightsToEditable();
            document.getElementById('left-column').appendChild(downloadBTN);
            document.getElementById('clear-button').style.visibility = 'visible';
            document.getElementById('drag-n-drop').remove();
            document.getElementById('textArea').remove();
        };
    };
}
const pasteEvent = (e) => {
    let paste = (e.clipboardData || window.clipboardData).getData('text/html');
    modifyTable(paste);
};

const textAreaModified = (e) => {
    if (e.target.value.length === 0) {
        if (document.getElementById('download-button') !== null) document.getElementById('download-button').remove();
        clearBTN.style.visibility = 'hidden';
    }
    else if (e.target.value.trim().length > 0) {
        clearBTN.style.visibility = 'visible';
    }
}

const addListernerToTextarea = () => {
    let textArea = document.getElementById('textArea');
    textArea.addEventListener('change', textAreaModified);
    textArea.addEventListener('input', textAreaModified);
    textArea.addEventListener('paste', pasteEvent);
}
let clearBTN = document.getElementById('clear-button');

clearBTN.addEventListener('click', (e) => {
    if (document.getElementById('textArea') !== null) document.getElementById('textArea').remove();
    addTemplateToDOM();
    let textAreaEl = document.createElement('textarea')
    textAreaEl.id = "textArea";
    textAreaEl.placeholder = "Copy / Paste the entire last update email here";
    textAreaEl.addEventListener('change', textAreaModified);
    textAreaEl.addEventListener('input', textAreaModified);
    textAreaEl.addEventListener('paste', pasteEvent);
    document.getElementById('form-inputs').appendChild(textAreaEl);
    createDragAndDropArea();
    clearBTN.style.visibility = 'hidden';
    templateStore = {};
    if (document.getElementById('download-button') !== null) document.getElementById('download-button').remove();
});