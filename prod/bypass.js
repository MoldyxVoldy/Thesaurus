//import predict  from './predict.js';
// import grammarify from "grammarify";
import reword from './reword.js';
import correct from './grammarly.js';

let fixed = []


const rewrite = async (document, basic = true) => {
    console.log(document)
    let sentences = document.match(/[^\.!\?]+[\.!\?]+/g).map(x => {return {sentence: x}});
    console.log('WHILE TRUE LOOP')
    console.log(sentences)
    const reword_s = async sentence => {
        if(!sentence) return
        console.log('still detected')
        const s_data = await reword(sentence.sentence, basic)
        let corrected = await correct(s_data)
        fixed.push([s_data, corrected])
        sentences[sentences.indexOf(sentence)].sentence = await correct(corrected)
    }
    await Promise.all(sentences.map(reword_s)) 



    console.log('done')
    let corrected = await correct(sentences.map((x, idx) => {
        return x.sentence
    }).join(' '))
    console.log('correction 1 finished')
    return await correct(corrected)
}

export default rewrite