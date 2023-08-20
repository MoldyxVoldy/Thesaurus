import findWordInfo from './wordinfo.js';
  


const reword = async (sentence, basic = true) => {
    let words = sentence.split(" ");
    let newWords = "";
    let num_words = Math.floor(words.length * 15 / 100);
    let indexed_words = words.map((word, index) => {return {word, index}})

    let filtered_words = indexed_words.filter(word => (word.word.replace(/[^A-Za-z]/g, '').length > 3 && !/[A-Z\d]/g.test(word.word) && !['all', 'another', 'any', 'anybody', 'anyone', 'anything', 'as', 'aught', 'both', 'each', 'each other', 'either', 'enough', 'everybody', 'everyone', 'everything', 'few', 'he', 'her', 'hers', 'herself', 'him', 'himself', 'his', 'I', 'idem', 'it', 'its', 'itself', 'many', 'me', 'mine', 'most', 'my', 'myself', 'naught', 'neither', 'no one', 'nobody', 'none', 'nothing', 'nought', 'one', 'one another', 'other', 'others', 'ought', 'our', 'ours', 'ourself', 'ourselves', 'several', 'she', 'some', 'somebody', 'someone', 'something', 'somewhat', 'such', 'suchlike', 'that', 'their', 'theirs', 'theirself', 'theirselves', 'them', 'themself', 'themselves', 'there', 'these', 'they', 'thine', 'this', 'those', 'thyself', 'us', 'we', 'what', 'whatever', 'whatnot', 'whatsoever', 'whence', 'where', 'whereby', 'wherefrom', 'wherein', 'whereinto', 'whereof', 'whereon', 'wherever', 'wheresoever', 'whereto', 'whereunto', 'wherewith', 'wherewithal', 'whether', 'which', 'whichever', 'whichsoever', 'who', 'whoever', 'whom', 'whomever', 'whomso', 'whomsoever', 'whose', 'whosever', 'whosesoever', 'whosoever', 'you', 'your', 'yours', 'yourself', 'yourselves'].includes(word.word) && !['am', 'did', 'having', 'should', 'are', 'do', 'is', 'was', 'be', 'does', 'may', 'were', 'been', 'going', 'to', 'might', 'will', 'being', 'had', 'must', 'will', 'be', 'can', 'has', 'ought', 'to', 'will', 'have', 'could', 'have', 'shall', 'would'].includes(word.word)))
    
    console.log(filtered_words)

    for (let i = 0; i < filtered_words.length; i++) {
        //let meanings, synonyms
        if(i > filtered_words.length)break
        let multi_word = false, i_incriment = false
        let multi_word_index = indexed_words.indexOf(filtered_words[i])
        console.log('Word equivilent', indexed_words[multi_word_index + 1])
        console.log('lookahead word', filtered_words[i + 1])
        if(indexed_words[multi_word_index + 1] == filtered_words[i + 1] && filtered_words[i + 1] != undefined) multi_word = `${filtered_words[i].word.replace(/[^A-Za-z]/g, '')} ${indexed_words[multi_word_index + 1].word.replace(/[^A-Za-z]/g, '')}`





        let {meanings, synonyms} = await findWordInfo(multi_word ? multi_word : filtered_words[i].word.replace(/[^A-Za-z]/g, ''))
        console.log(synonyms)
        if(synonyms[0].synonym == multi_word || !multi_word) ({meanings, synonyms} = await findWordInfo(filtered_words[i].word.replace(/[^A-Za-z]/g, '')))
        else i_incriment = true
        console.log()

        filtered_words[i].meanings = meanings
        filtered_words[i].synonyms = synonyms
        if(i_incriment) {
            filtered_words[i].multi = true
            i++
            filtered_words[i].meanings = Infinity
            filtered_words[i].synonyms = []
        }

    }

    

    console.log(filtered_words)
    console.log(JSON.stringify(filtered_words))

    filtered_words.sort((a,b) => a.meanings-b.meanings)

    console.log(filtered_words)


    let chosen_indices = new Array()
    let multi_indices = new Array()
    let wordInfo = new Object()

    while((chosen_indices.length + multi_indices.length) < num_words && filtered_words.length > 0){
        let word =  filtered_words.shift()
        wordInfo[word.index] = word
        if(word.multi)multi_indices.push(word.index)
        else chosen_indices.push(word.index)
    }

    console.log('chosen_indices', chosen_indices)
    console.log('multi_indices', multi_indices)
    console.log('wordInfo', wordInfo)
    for (let i = 0; i < words.length; i++) {
            if (chosen_indices.includes(i) || multi_indices.includes(i)) {
                console.log(wordInfo[i])
                let {word, synonyms} = wordInfo[i]
                if(wordInfo[i].multi)i++
                let endswith = "";
                if (word.endsWith(".") || word.endsWith(",") || word.endsWith("!") || word.endsWith("'") || word.endsWith("?") || word.endsWith(":") || word.endsWith(";")) {
                  endswith = word[word.length - 1];
                  word = word.substr(0, word.length - 1); 
                }
                console.log('syns:', synonyms)
                if (word.length > 3 && synonyms && synonyms.length != 0) {
                    console.log('old word:', word) 

                    if(synonyms.legth < 3) return

                    let compared_synonyms = synonyms
                    synonyms = synonyms.map(synonym => synonym.synonym)
                    
                    console.log('FILTER? SYNONYMS', synonyms.filter(synonym => !(synonym.includes(word) || word.includes(synonym) && word != synonym)))
                    let vowel_avg = Math.round(synonyms.reduce((acc, val) => {
                        return acc+(val.match(/[aeiuo]/g) || []).length
                    }, 0)/synonyms.length)
                    console.log(vowel_avg)
                    compared_synonyms = compared_synonyms.filter(synonym => synonym.compared_meanings <= Math.min(...compared_synonyms.map(synonym => synonym.compared_meanings)) + 3)
                    let max_compared_score = compared_synonyms.filter(synonym => synonym.compared_score == Math.max(...compared_synonyms.map(synonym => synonym.compared_score)))
                    console.log('mcs', max_compared_score)
                    compared_synonyms.forEach(word => {
                        let word_score = word.synonym.length
                        let sub_amount = 3
                        sub_amount += word.synonym.match(/[\- ]/g)?.length * 4 || 0
                        if(sub_amount >= word.synonym.replace(/[\- ]/g, '').length) return
                        if((word.synonym.match(/[aeiuo]/g) || []).length > vowel_avg) sub_amount -= 2
                        word_score += word.compared_score * 2
                        if(max_compared_score.includes(word)) word_score += 314
                        if((word.synonym.match(/[A-Z]/g) || []).length > 0)sub_amount = word_score-1
                        synonyms = Array((word_score-sub_amount) * 2)?.fill(word.synonym)?.concat(synonyms)
                    })
                    console.log(synonyms)
                    //console.log('synsV2:', synonyms)
                    word = synonyms[Math.floor(Math.random() * synonyms.length)];
                    console.log('new word:', word)
                }
                    
                 
                newWords += word + endswith + " ";
            } else {
                newWords += words[i];
                if(i !== words.length - 1) {
                newWords += " ";
                }
            }
    } console.log(newWords)
    return newWords
        
}

export default reword