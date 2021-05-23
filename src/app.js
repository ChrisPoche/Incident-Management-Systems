// let inputFile = document.getElementById('fileInput');
let textArea = document.getElementById('textArea');
let downloadBTN = document.getElementById('download-button');
let clearBTN = document.getElementById('clear-button');

// Remove the scroll bar from field of view for template
document.getElementById('template').style.paddingRight = `${document.getElementById('template').offsetWidth - document.getElementById('template').clientWidth + 10}px`;
document.getElementById('template').style.right = `-${document.getElementById('template').offsetWidth - document.getElementById('template').clientWidth}px`;

clearBTN.addEventListener('click', (e) => {
    textArea.value = '';
    clearBTN.style.visibility = 'hidden';
    downloadBTN.style.visibility = 'hidden';
});

const textAreaModified = (e) => {
    if (e.target.value.length === 0) {
        downloadBTN.style.visibility = 'hidden';
        clearBTN.style.visibility = 'hidden';
    }
    else if (e.target.value.trim().length > 0) {
        clearBTN.style.visibility = 'visible';
    }
}

textArea.addEventListener('change', textAreaModified);
textArea.addEventListener('input', textAreaModified);

// Get hmtl from paste event, not just plain text
textArea.addEventListener('paste', (e) => {
    let paste = (e.clipboardData || window.clipboardData).getData('text/html');
    let table = paste.substring(paste.indexOf('<table'), paste.indexOf('</table') + 8);
    // console.log(table);

    // Move down Current Update
    let sections = table.split('<tr');
    // console.log(sections);
    let focusSection = 'Current &';
    const findCurrentUpdate = (e) => e.indexOf(focusSection) !== -1;
    let csTableRow = sections.findIndex(findCurrentUpdate) + 1;
    let currentUpdateSection = sections[csTableRow]
    // console.log(currentUpdateSection);
    // csLines = (current section) Lines
    let csLines = currentUpdateSection.split('<span');

    let currentDateString = csLines[1].substring(csLines[1].indexOf('>') + 1).substring(0, csLines[1].substring(csLines[1].indexOf('>') + 1).indexOf('</span>'));
    let currentUpdateDate = new Date(currentDateString);
    let now = new Date();
    // Format Now Date for template
    let options = { month: 'long', day: 'numeric', year: 'numeric' };
    let nowDateString = now.toLocaleDateString('en-US', options);
    
    // Inserting 4 indexes before Current Update for Next Update - date, time, content, cadence
    csLines.splice(1, 0, csLines[1].replace(currentDateString, nowDateString));
    csLines.splice(2, 0, csLines[3].replace(csLines[3].substring(csLines[3].indexOf('>') + 1).substring(0, csLines[3].substring(csLines[3].indexOf('>') + 1).indexOf('</span>')), '[H:MM AM/PM]'));
    csLines.splice(3, 0, csLines[5].replace(csLines[5].substring(csLines[5].indexOf('>') + 1).substring(0, csLines[5].substring(csLines[5].indexOf('>') + 1).indexOf('</span>')), "[The next update's text goes here...]"));
    csLines.splice(4, 0, csLines[7].replace(csLines[7].substring(csLines[7].indexOf('>') + 1).substring(0, csLines[7].substring(csLines[7].indexOf('>') + 1).indexOf('</span>')), 'The next update on this issue will come no later than [H:MM AM/PM]'));
    // Grab 3 elements from Prior Update to move to Previous Updates Section 
    let prevDate = csLines[csLines.length-3];
    let prevTime = csLines[csLines.length-2];
    let prevContent = csLines[csLines.length-1].substring(0,csLines[csLines.length-1].indexOf('</td>'));
    // Remove last 4 - next update time boilerplate (Current) and previous update's date, time and content
    csLines.pop(); csLines.pop(); csLines.pop(); csLines.pop();
    console.log(prevDate)
    console.log(prevTime)

    // If dates are the same, remove second date value
    let currentDateCheck = currentUpdateDate.getMonth() + '/' + currentUpdateDate.getDate() + '/' + currentUpdateDate.getFullYear();
    let nowDateCheck = now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear();
    if (currentDateCheck === nowDateCheck) {
        csLines.splice(5, 1);
    }
    // Add closing tags for table data (td) and row (tr) to ensure there is no broken formating
    csLines[csLines.length-1] = csLines[csLines.length-1]+'</td></tr>';

    // Previous Section
    const findPrevUpdate = (e) => e.indexOf('Previous Update') !== -1;
    let psTableRow = sections.findIndex(findPrevUpdate) + 1;
    let prevUpdateSection = sections[psTableRow]
    // console.log(prevUpdateSection);
    let psLines = prevUpdateSection.split('<span');
    console.log(psLines);
    let firstPrevDateString = psLines[1].substring(psLines[1].indexOf('>') + 1).substring(0, psLines[1].substring(psLines[1].indexOf('>') + 1).indexOf('</span>'));
    let firstPrevUpdateDate = new Date(firstPrevDateString);
    let prevUpdateDate = new Date(prevDate.substring(prevDate.indexOf('>') + 1).substring(0, prevDate.substring(prevDate.indexOf('>') + 1).indexOf('</span>')));

    // Inserting 3 indexes before first Prev Update
    psLines.splice(1, 0, prevDate);
    psLines.splice(2, 0, prevTime);
    psLines.splice(3, 0, prevContent);
    
    // If dates are the same, remove second date value
    let firstPrevDateCheck = firstPrevUpdateDate.getMonth() + '/' + firstPrevUpdateDate.getDate() + '/' + firstPrevUpdateDate.getFullYear();
    let prevDateCheck = prevUpdateDate.getMonth() + '/' + prevUpdateDate.getDate() + '/' + prevUpdateDate.getFullYear();
    if (prevDateCheck === firstPrevDateCheck) {
        psLines[3] = psLines[3]+psLines[4].substring(psLines[4].indexOf('<p'));
        psLines.splice(4, 1);
    }

    // Rebuild table
    sections.splice(csTableRow,1,csLines.join('<span'));
    sections.splice(psTableRow,1,psLines.join('<span'));
    table = sections.join('<tr')
    // console.log(table);


    // Grab values and concat subject
    let header = table.substring(table.indexOf('<span')).substring(table.substring(table.indexOf('<span')).indexOf('>') + 1, table.substring(table.indexOf('<span')).indexOf('</span>')).split(' – ').map(s => s.trim());
    let status = `(${header[0]})`;
    let priority = header[1];
    let ticketNumber = table.substring(table.indexOf('<a')).substring(table.substring(table.indexOf('<a')).indexOf('>') + 1, table.substring(table.indexOf('<a')).indexOf('</a>'));
    let account = header[2];
    let subject = `${status} - ${priority} - ${ticketNumber} - ${account}`;

    if (table.indexOf('<table') !== -1 && table.indexOf('<script') === -1) {
        // Replace template with table
        let template = document.getElementById('template');
        template.innerHTML = table;

        // Download Button Actions
        downloadBTN.style.visibility = 'visible';
        downloadBTN.addEventListener('click', (e) => {
            downloadBTN.style.visibility = 'hidden';
            let email = {
                to: 'test@test.com',
                subject,
                body: '<html><body>' + table + '</body></html>'
            }

            let emailText = 'To: ' + email.to + '\n';
            emailText += 'Subject: ' + email.subject + '\n';
            emailText += 'X-Unsent: 1' + '\n';
            emailText += 'Content-Type: text/html; charset="UTF-8"' + '\n';
            emailText += '' + '\n';
            emailText += email.body;

            window.api.send('toMain', emailText);

            window.api.receive("fromMain", (data) => {
                // console.log(`Status: ${data}`);
                let time = new Date();
                if (data[0] === 'write complete') {
                    let a = document.createElement('a');
                    a.href = '../template.eml';
                    a.id = 'file-link';
                    a.download = subject.replace(/\s/g, '') + '_' + time.getHours() + '_' + time.getMinutes() + '_' + time.getSeconds() + '.eml';
                    a.style.visibility = 'hidden';
                    document.body.appendChild(a);
                    document.getElementById('file-link').click();
                }
            });
        });
    }
})


// inputFile.addEventListener('change', (f) => {
//     let input = f.target;
//     console.log(input);

//     let reader = new FileReader();
//     reader.onload = () => {
//         var output = reader.result;
//         // let val = output.split('/').filter((i) => i.length > 1).filter((v,i) => i > 1).map(v => atob(v));
//         console.log(output);
//     }

//     reader.readAsText(input.files[0]);
// })

//-------------------------------
// Logic to Check if date exists for next update - keep for Prev Updates Section
// let prevDate;
// let secondDate = lines[5].indexOf('AM') === -1 && lines[5].indexOf('PM') === -1;
// if (secondDate) {
//}
