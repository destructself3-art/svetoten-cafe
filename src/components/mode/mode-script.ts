// Runs in <head> before the first paint so the page never flashes the wrong light.
// Day is 07:00–18:00 café time (UTC+3). A manual choice is kept until the next natural switch.
export const MODE_STORAGE_KEY = "svetoten-mode";

export const modeScript = `(function(){var d=document.documentElement;try{var o=JSON.parse(localStorage.getItem('${MODE_STORAGE_KEY}')||'null');if(o&&(o.mode==='day'||o.mode==='night')&&o.until>Date.now()){d.dataset.mode=o.mode;d.dataset.modeSource='manual';return;}}catch(e){}var n=new Date();var m=(n.getUTCHours()*60+n.getUTCMinutes()+180)%1440;d.dataset.mode=(m>=420&&m<1080)?'day':'night';d.dataset.modeSource='auto';})();`;
