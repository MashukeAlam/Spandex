console.log('Alhamdulillah');
let userId = ""


const id = (id) => {
    return document.getElementById(id);
}

window.addEventListener('load', () => {
    const minus = id('header').clientHeight
    id('latexEditor').style.height = (window.innerHeight - minus - 15).toString() + "px";
    id('submit').style.height = (window.innerHeight - minus - 15).toString() + "px";
    id('pdfViewer').style.height = (window.innerHeight - minus - 15).toString() + "px";

});

window.addEventListener("beforeunload", function (e) {
    console.log('yo');
    fetch('/delete', {
        method: "POST",
        body: JSON.stringify({userId}),
        headers: {"Content-type": "application/json; charset=UTF-8"}

    });
  
                               
  });


const getId = () => {
    fetch('/getId', {
        method: "GET",
        headers: { "Content-type": "application/json;charset=UTF-8" }
    })
    .then(response => response.json())  // convert to json
    .then(json => {
        console.log(json, json['userId']);
        userId = json['userId'];
        editorStatusDOM = id('statusEditor');
        editorStatusDOM.innerHTML = `Editor ready for user id < ${json.userId} >`;
        editorStatusDOM.className = editorStatusDOM.className.replace('failed', 'success');
    })    //print data to console
    .catch(err => console.log('Request Failed', err));
}

const submitPdf = () => {
    editor = id('latexEditor');
    console.log(editor.value);

    let tex = {
        body: editor.value,
        date: new Date().toISOString(),
        userId: userId
       
    }

    fetch('/submit', {
        method: "POST",
        body: JSON.stringify(tex),
        headers: {"Content-type": "application/json; charset=UTF-8"}

    }).then(response => response.json()) 
    .then(json => {console.log(json)
        id('pdfViewer').setAttribute("src" , `/temp/temp_${userId}.pdf`);
    })
    .catch(err => console.log(err));
}

getId()