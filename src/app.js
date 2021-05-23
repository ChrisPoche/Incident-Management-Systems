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
    // console.log(paste)
    let table = paste.substring(paste.indexOf('<table'), paste.indexOf('</table') + 8);
    // console.log(table);
    
    if (table.indexOf('<table') !== -1) {
        downloadBTN.style.visibility = 'visible';
        downloadBTN.addEventListener('click', (e) => {
            downloadBTN.style.visibility = 'hidden';
            let email = {
                to: 'test@test.com',
                subject: 'Subject to Change',
                body: '<html><body>' + table + '</body></html>'
            }

            let emailText = 'To: ' + email.to + '\n';
            emailText += 'Subject: ' + email.subject + '\n';
            emailText += 'X-Unsent: 1' + '\n';
            emailText += 'Content-Type: text/html' + '\n';
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
                    a.download = 'template'+time.getHours()+'-'+time.getMinutes()+'-'+time.getSeconds()+'.eml'; // will eventually be subject with timestamp 
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
