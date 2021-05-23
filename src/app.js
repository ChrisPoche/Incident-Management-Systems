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
    const findCurrentUpdate = (e) => e.indexOf('Current &') !== -1;
    let tableRow = sections.findIndex(findCurrentUpdate) + 1;
    let currentUpdateSection = sections[tableRow]
    // console.log(currentUpdateSection);
    let lines = currentUpdateSection.split('<span');

    let currentDateString = lines[1].substring(lines[1].indexOf('>') + 1).substring(0, lines[1].substring(lines[1].indexOf('>') + 1).indexOf('</span>'));

    let currentUpdateDate = new Date(currentDateString);
    let now = new Date();
    // Format Now Date for template
    let options = { month: 'long', day: 'numeric', year: 'numeric' };
    let nowDateString = now.toLocaleDateString('en-US', options);
    
    // Inserting 4 indexes before Current Update for Next Update - date, time, content, cadence
    lines.splice(1, 0, lines[1].replace(currentDateString, nowDateString));
    lines.splice(2, 0, lines[3].replace(lines[3].substring(lines[3].indexOf('>') + 1).substring(0, lines[3].substring(lines[3].indexOf('>') + 1).indexOf('</span>')), '[H:MM AM/PM]'));
    lines.splice(3, 0, lines[5].replace(lines[5].substring(lines[5].indexOf('>') + 1).substring(0, lines[5].substring(lines[5].indexOf('>') + 1).indexOf('</span>')), "[The next update's text goes here...]"));
    lines.splice(4, 0, lines[7].replace(lines[7].substring(lines[7].indexOf('>') + 1).substring(0, lines[7].substring(lines[7].indexOf('>') + 1).indexOf('</span>')), 'The next update on this issue will come no later than [H:MM AM/PM]'));
    // Remove last 4 - next update time boilerplate (Current) and previous update's date, time and content
    lines.pop(); lines.pop(); lines.pop(); lines.pop();
    
    // If dates are the same, remove second date value
    let currentDateCheck = currentUpdateDate.getMonth() + '/' + currentUpdateDate.getDate() + '/' + currentUpdateDate.getFullYear();
    let nowDateCheck = now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear();
    if (currentDateCheck === nowDateCheck) {
        lines.splice(5, 1);
    }

    // Rebuild table
    sections.splice(tableRow,1,lines.join('<span'));
    table = sections.join('<tr')
    console.log(table);


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
