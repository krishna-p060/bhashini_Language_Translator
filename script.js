const selectTag = document.querySelectorAll('select');
const fromText = document.querySelector('.from-text');
toText = document.querySelector('.to-text');
selectTag.forEach(tag => {
    for(const code in language){
        
        let option = `<option value="${code}">${language[code]}</option>`;
        tag.insertAdjacentHTML('beforeend',option);
    }
});

const req = async () => {
    let text = fromText.value,
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    const firstRequestBody = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": translateFrom,
                        "targetLanguage": translateTo
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId": "64392f96daac500b55c543cd"
        }
    };

    const response = await fetch('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline', {
        method: "POST",
        headers: {
            "userID": "1e4705f1cb3a4e6eafea35b3f98def60",
            "ulcaApiKey": "073a28eb1e-e4c0-4fb0-8137-58adfeb754cc",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(firstRequestBody) 
    });

    const data = await response.json();
    const callbackUrl = data['pipelineInferenceAPIEndPoint']["callbackUrl"];
	const apiKey = data['pipelineInferenceAPIEndPoint']["inferenceApiKey"]["value"];
	const serviceId = data['pipelineResponseConfig'][0]['config'][0]['serviceId'];

	const secondResponse = await fetch(callbackUrl, {
		method: "POST",
		headers: {
            "Content-Type": "application/json",
			"Authorization": apiKey,
		},
		body: JSON.stringify({
    "pipelineTasks": [
        {
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": translateFrom,
                    "targetLanguage": translateTo
                },
                "serviceId": serviceId,
            }
        }
    ],
    "inputData": {
        "input": [
            {
                "source": text
            }
        ],
        "audio": [
            {
                "audioContent": null
            }
        ]
    }
})
	});

	const secData = await secondResponse.json();
	const output = secData["pipelineResponse"][0]["output"][0]["target"];
	console.log(output);
    
    toText.value = output;
}

const btn = document.querySelector('button');
btn.addEventListener('click', req);



