const findWordInfo = async word => {
    try{
      
      let data = await fetch(`https://tuna.thesaurus.com/pageData/${word}`).then(res => res.json())
      console.log(data) 
      
      let meanings = data.data.definitionData.definitions.length
  
      let {synonyms} = data.data.definitionData.definitions[0]
  
      synonyms = synonyms.filter(synonym => Number(synonym.similarity) >= 100).map(synonym => synonym.term)
  
      let vowel_avg = Math.round(synonyms.reduce((acc, val) => acc+(val.match(/[aeiuo]/g) || []).length, 0)/synonyms.length)
  
      if(vowel_avg <= 2 || synonyms.length < 2) synonyms = data.data.definitionData.definitions[0].synonyms.filter(synonym => Number(synonym.similarity) >= Number(data.data.definitionData.definitions[0].synonyms[1].similarity)).map(synonym => synonym.term)
  
  
      let compared_data = await fetch(`https://tuna.thesaurus.com/comparison?root=${word}&match=${synonyms.join()}&pos=0`).then(res => res.json())
      let compared = compared_data.data.matches.map(word => word.sharedSynonyms.length + word.sharedAntonyms.length)
      let compared_meanings = compared_data.data.matches.map(word => word.definitions.length)
  
      synonyms = synonyms.map((synonym, idx) => {return {synonym, compared_score: compared[idx], compared_meanings: compared_meanings[idx]}}) 
     
      return {synonyms, meanings}
    } catch (error){
      return {synonyms: [{synonym: word, compared_score: 0, compared_meanings: Infinity}], meanings: Infinity}
    }
  }
  
  export default findWordInfo