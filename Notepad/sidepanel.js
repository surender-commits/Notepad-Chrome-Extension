const $ = id => document.getElementById(id);

// Mapping to the IDs in sidepanel.html
const copyTxt = $('copy_txt');
const txt = $('txt');
const btnPaste = $('paste_btn');
const btnCopy = $('copy_btn');
const btnAMin = $('A-');
const btnA = $('A');
const btnAPlus = $('A+');
const btnClearAll = $('clear_all');

// Consolidated storage key
const STORAGE_KEY = 'notepadData';
const DEF_FS = 20;
const DEFAULTS = { c: "", t: "\n".repeat(24) };

// Helper: Set font size for both textareas
const updateFS = (size) => {
    const val = typeof size === 'number' ? size + 'px' : size;
    copyTxt.style.fontSize = txt.style.fontSize = val;
};

// --- Storage Operations ---
const saveData = () => {
    chrome.storage.local.set({
        [STORAGE_KEY]: {
            copy_text: copyTxt.value,
            text: txt.value,
            fs: txt.style.fontSize
        }
    });
};

const loadData = () => {
    chrome.storage.local.get([STORAGE_KEY], (res) => {
        const data = res[STORAGE_KEY] || {};

        // Use the new keys: copy_text, text, and fs
        copyTxt.value = data.copy_text || DEFAULTS.c;
        txt.value = data.text || DEFAULTS.t;
        updateFS(data.fs || DEF_FS);
    });
};

// --- Font Size Logic ---
const changeFS = (delta) => {
    const current = parseFloat(txt.style.fontSize) || DEF_FS;
    updateFS(Math.max(8, current + delta));
    saveData();
};

// --- Clipboard Actions ---
btnPaste.onclick = async () => {
    try {
        const text = await navigator.clipboard.readText();
        copyTxt.value = text;
        saveData();
    } catch (err) {
        console.error('Failed to read clipboard:', err);
    }
};

btnCopy.onclick = () => {
    navigator.clipboard.writeText(copyTxt.value);
    // Visual cue
    const originalText = btnCopy.innerText;
    btnCopy.innerText = "Done!";
    setTimeout(() => btnCopy.innerText = originalText, 1000);
};

// --- Event Listeners ---
txt.addEventListener('input', saveData);
copyTxt.addEventListener('input', saveData);

btnAMin.onclick = () => changeFS(-2);
btnAPlus.onclick = () => changeFS(2);
btnA.onclick = () => {
    updateFS(DEF_FS);
    saveData();
};

btnClearAll.onclick = () => {
    if (confirm("Clear all text?")) {
        copyTxt.value = DEFAULTS.c;
        txt.value = DEFAULTS.t;
        saveData();
    }
};

// Initialize
loadData();



// const $ = id => document.getElementById(id);

// // Mapping to the new IDs in sidepanel.html
// const copyTxt = $('copy_txt');
// const txt = $('txt');
// const btnPaste = $('paste_btn');
// const btnCopy = $('copy_btn');
// const btnAMin = $('A-');
// const btnA = $('A');
// const btnAPlus = $('A+');
// const btnClearAll = $('clear_all');

// const KEYS = { CPY: 'notepadCopyData', TXT: 'notepadData' };
// const DEF_FS = 20;
// const DEFAULTS = { c: "\n".repeat(0), t: "\n".repeat(24) };

// // Helper: Set font size for both textareas
// const updateFS = (size) => {
//     const val = typeof size === 'number' ? size + 'px' : size;
//     copyTxt.style.fontSize = txt.style.fontSize = val;
// };

// // --- Storage Operations ---
// const saveData = () => {
//     chrome.storage.local.set({
//         [KEYS.CPY]: { text: copyTxt.value },
//         [KEYS.TXT]: { text: txt.value, fs: txt.style.fontSize }
//     });
// };

// const loadData = () => {
//     chrome.storage.local.get([KEYS.CPY, KEYS.TXT], (res) => {
//         const { [KEYS.CPY]: cData, [KEYS.TXT]: tData } = res;

//         copyTxt.value = cData?.text || DEFAULTS.c;
//         txt.value = tData?.text || DEFAULTS.t;
//         updateFS(tData?.fs || DEF_FS);
//     });
// };

// // --- Font Size Logic ---
// const changeFS = (delta) => {
//     const current = parseFloat(txt.style.fontSize) || DEF_FS;
//     updateFS(Math.max(8, current + delta));
//     saveData();
// };

// // --- Clipboard Actions ---
// btnPaste.onclick = async () => {
//     try {
//         const text = await navigator.clipboard.readText();
//         copyTxt.value = text;
//         saveData();
//     } catch (err) {
//         console.error('Failed to read clipboard:', err);
//     }
// };

// btnCopy.onclick = () => {
//     navigator.clipboard.writeText(copyTxt.value);
//     // Optional: add a visual cue that it copied
//     const originalText = btnCopy.innerText;
//     btnCopy.innerText = "Done!";
//     setTimeout(() => btnCopy.innerText = originalText, 1000);
// };

// // --- Event Listeners ---
// txt.addEventListener('input', saveData);
// copyTxt.addEventListener('input', saveData);

// btnAMin.onclick = () => changeFS(-2);
// btnAPlus.onclick = () => changeFS(2);
// btnA.onclick = () => { updateFS(DEF_FS); saveData(); };

// btnClearAll.onclick = () => {
//     if (confirm("Clear all text?")) {
//         copyTxt.value = DEFAULTS.c;
//         txt.value = DEFAULTS.t;
//         saveData();
//     }
// };

// // Initialize
// loadData();