import fetch from "node-fetch";

const url = "http://ec2-44-226-228-62.us-west-2.compute.amazonaws.com:8080/api/actions"

async function postData(){
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: "Hello World",
            action: "jsdoc"
        })
    }    )
    console.log(response)
        const responseData = await response.json();
        console.log(responseData);


}

postData();