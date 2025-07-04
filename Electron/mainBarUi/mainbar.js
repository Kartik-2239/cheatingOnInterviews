
document.addEventListener('DOMContentLoaded', () => {
    
    // document.addEventListener('keydown', async (event) => {
    //     const pixelDistanceHorizontal = 75
    //     const pixelDistanceVertical = 50
    //     if (event.metaKey && event.key === 'ArrowRight') {
    //         event.preventDefault()
    //         window.electronAPI.moveWindow(pixelDistanceHorizontal, 0);
    //     }
    //     if (event.metaKey && event.key === 'ArrowLeft') {
    //         event.preventDefault()
    //         window.electronAPI.moveWindow(-pixelDistanceHorizontal, 0);
    //     }
    //     if (event.metaKey && event.key === 'ArrowUp') {
    //         event.preventDefault()
    //         window.electronAPI.moveWindow(0, -pixelDistanceVertical); 
    //     }
    //     if (event.metaKey && event.key === 'ArrowDown') {
    //         event.preventDefault()
    //         window.electronAPI.moveWindow(0, pixelDistanceVertical);
    //     }
    //     if (event.metaKey && event.code === 'KeyK') {
    //         window.electronAPI.changeSize()
    //     }
    // }, {passive:false});
    const aiBtn = document.getElementById('ai-btn')
    aiBtn.addEventListener('click',()=>{

        window.electronAPI.ansBtn()
        window.electronAPI.getAnswer()
    })

    const settingBtn = document.getElementById('setting-btn')
    settingBtn.addEventListener('click',()=>{

        window.electronAPI.settingBtn()
    })



});

