const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');

//process of pop up is happening here, we will call the pickcolor fuction here to get the return value of selected color
btn.addEventListener('click', async () => { 

    chrome.storage.sync.get('color', ({ color }) => {
        console.log('color: ', color);
    });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: pickColor,
        },
        async (injectionResults) => {
            const [data] = injectionResults;
            if (data.result) {
                const color = data.result.sRGBHex; //result variable from eyedropper
                colorGrid.style.backgroundColor = color; //to diplay the square block of color
                colorValue.innerText = color; //to show the code of selected color
                try {
                    await navigator.clipboard.writeText(color);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    );
});

async function pickColor() { //the process of color extraction is happening here
    try {
        // Picker
        const eyeDropper = new EyeDropper();//experimental feature but compatible with chrome
        return await eyeDropper.open(); //returns the selected color
    } catch (err) {
        console.error(err);
    }
}
