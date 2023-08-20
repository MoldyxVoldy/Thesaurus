import { launch } from "puppeteer"; 
import express from 'express';
const app = express()


app.get('/', (req, res) => {
    res.send('')
})




app.listen(2168, () => console.log('Listening on port 2168'))

//await new Promise(r => setTimeout(r, 1000000))

let browser = await launch()//{headless: false})

let [ page ] = await browser.pages()

await page.goto('http://localhost:2168/')

await new Promise(r => setTimeout(r, 1000))

await page.evaluate('(async() => {const n={async load(n,r){throw new Error("SDK loader is not configured.")}};function r(r){n.load=r}async function t(r,t){return new((await n.load("https://js.grammarly.com/grammarly-sdk@2.5",r)).SDK)(r,t)}function e(){const n=globalThis.Grammarly;if(null==n)throw new Error("Grammarly SDK is not loaded.");return n}if("function"==typeof importScripts)r((async n=>(importScripts(n),e())));else{let n=null;r((async r=>(null!=n||(n=new Promise(((n,t)=>{try{let n=function(n){return document.querySelectorAll(`script[src^="${n}"]`)[0]}(r);null!=n?(console.warn(`<script src="${r}" /> already exists.`),o()):(n=function(n){const r=document.createElement("script");return r.src=n,document.head.appendChild(r),r}(r),n.addEventListener("load",o),n.addEventListener("error",a))}catch(n){a(n)}function o(){n(e())}function a(n){t(n)}}))),await n)))}; window.Grammarly = await t("client_V3C4rjxqowrjYTxZUtTKZ1")})()')

const correct = async sentence => {
    let corrected = await page.evaluate(async sentence => await new Promise(r => {
        const editor = Grammarly.withText(sentence);
        editor.addEventListener("status", (event) => {
          if (event.detail === "idle") {
            editor.disconnect();
            
            r(sentence)
            console.debug(sentence)
          }
        });
        editor.addEventListener("suggestions", (event) => {
          event.detail.added.forEach((suggestion) => {
            console.log(sentence, suggestion);
            if(suggestion.replacements[0].preview.length > 3 && (suggestion.replacements[0].preview[3]?.type || '' == 'del' || suggestion.replacements[0].preview[4]?.type || '' == 'del')) return sentence = sentence.replace(`${suggestion.replacements[0].preview[0]}${suggestion.replacements[0].preview[1]?.type || '' == 'del' ? suggestion.replacements[0].preview[1]?.children[0] : suggestion.replacements[0].preview[1]}${suggestion.replacements[0].preview[2]?.type || ''  == 'del' ? suggestion.replacements[0].preview[2]?.children[0] : suggestion.replacements[0].preview[2]}${suggestion.replacements[0].preview[3]?.type || ''  == 'del' ? suggestion.replacements[0].preview[3]?.children[0] : suggestion.replacements[0].preview[3]}${suggestion.replacements[0].preview[4]?.type || ''  == 'del' ? suggestion.replacements[0].preview[4]?.children[0] : suggestion.replacements[0].preview[4]}`, `${suggestion.replacements[0].preview[0]}${typeof(suggestion.replacements[0].preview[1]) == 'string' ? suggestion.replacements[0].preview[1] : ''}${typeof(suggestion.replacements[0].preview[2]) == 'string' ? suggestion.replacements[0].preview[2] : ''}${typeof(suggestion.replacements[0].preview[4]) == 'string' ? suggestion.replacements[0].preview[3] : ''}${typeof(suggestion.replacements[0].preview[4]) == 'string' ? suggestion.replacements[0].preview[4] : ''}`)
              if(suggestion.replacements[0].preview.length < 3) sentence = sentence.replace(suggestion.replacements[0].preview[0].children[0], suggestion.replacements[0].preview[1])
                else {
                    console.log('to replace:', `${suggestion.replacements[0].preview[0]}${suggestion.replacements[0].preview[1]?.type || '' == 'del' ? suggestion.replacements[0].preview[1]?.children[0] : ''}${suggestion.replacements[0].preview[2]?.type || ''  == 'del' ? suggestion.replacements[0].preview[2]?.children[0] : ''}${suggestion.replacements[0]?.preview[3] || ''}`)
                    console.log('with:', `${suggestion.replacements[0].preview[0]}${typeof(suggestion.replacements[0].preview[1]) == 'string' ? suggestion.replacements[0].preview[1] : ''}${typeof(suggestion.replacements[0].preview[2]) == 'string' ? suggestion.replacements[0].preview[2] : ''}${suggestion.replacements[0]?.preview[3] || ''}`)
                    console.warn(sentence.replace(`${suggestion.replacements[0].preview[0]}${suggestion.replacements[0].preview[1]?.type || '' == 'del' ? suggestion.replacements[0].preview[1]?.children[0] : ''}${suggestion.replacements[0].preview[2]?.type || ''  == 'del' ? suggestion.replacements[0].preview[2]?.children[0] : ''}${suggestion.replacements[0]?.preview[3] || ''}`, `${suggestion.replacements[0].preview[0]}${typeof(suggestion.replacements[0].preview[1]) == 'string' ? suggestion.replacements[0].preview[1] : ''}${typeof(suggestion.replacements[0].preview[2]) == 'string' ? suggestion.replacements[0].preview[2] : ''}${suggestion.replacements[0]?.preview[3] || ''}`))
                    sentence = sentence.replace(`${suggestion.replacements[0].preview[0]}${suggestion.replacements[0].preview[1]?.type || '' == 'del' ? suggestion.replacements[0].preview[1]?.children[0] : ''}${suggestion.replacements[0].preview[2]?.type || ''  == 'del' ? suggestion.replacements[0].preview[2]?.children[0] : ''}${suggestion.replacements[0]?.preview[3] || ''}`, `${suggestion.replacements[0].preview[0]}${typeof(suggestion.replacements[0].preview[1]) == 'string' ? suggestion.replacements[0].preview[1] : ''}${typeof(suggestion.replacements[0].preview[2]) == 'string' ? suggestion.replacements[0].preview[2] : ''}${suggestion.replacements[0]?.preview[3] || ''}`)
                }
          });
        });
    }), sentence)
    return corrected
}
export default correct