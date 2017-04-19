class NerDict {
    constructor(words) {
        this.root = {};

        if(words){
            this.build(words);
        }
    }

    build(words){
        console.log('building nerdict.');
        for(let w of words){
            this.add(w.value, w.type);
        }
        console.log('building nerdict done.');
    }

    add(word, type) {
        let currentNode = this.root;

        for (let c of word) {
            if (!currentNode[c]) {
                currentNode[c] = {};
            }
            currentNode = currentNode[c];
        }

        currentNode.word = word;
        currentNode.type = type;

        return this.root;
    }

    get(word) {
        let currentNode = this.root;

        for (let c of word) {
            if (!currentNode[c]) {
                break;
            }
            currentNode = currentNode[c];
        }

        return currentNode.type;
    }

    tag(sentence) {
        let node = this.root;

        let phrases = [];
        let tags = [];
        let prevLoc = 0;
        let startTagLoc = 0;

        for (let loc = 0; loc < sentence.length; loc++) {
            let c = sentence[loc];

            if (node[c]) {
                startTagLoc = loc;
                node = node[c];
                let type;

                while (true) {
                    if (loc + 1 < sentence.length) {
                        let nextC = sentence[loc + 1];
                        let nextNode = node[nextC];

                        if (!nextNode) {
                            //no next node
                            break;
                        }
                    } else {
                        //end of sentence
                        break;
                    }

                    loc++;
                    c = sentence[loc];
                    node = node[c];
                    type = node.type;
                }

                if (type) {
                    if (startTagLoc > prevLoc) {
                        phrases.push(sentence.substring(prevLoc, startTagLoc));
                        tags.push('');
                    }

                    phrases.push(sentence.substring(startTagLoc, loc + 1));
                    tags.push(type);
                    prevLoc = loc + 1;
                }
            }

            node = this.root;
        }

        if (sentence.length > prevLoc) {
            phrases.push(sentence.substring(prevLoc, sentence.length));
            tags.push('');
        }

        return { phrases, tags };
    }

}

module.exports = NerDict;

if (require.main === module) {
    let dict = new NerDict();
    let root = dict.add('สวัสดี', 'hello');
    root = dict.add('สวัสดีครับ', 'men hello');
    root = dict.add('อโศก', 'where');
    root = dict.add('อรุณสวัสดิ์', 'greet');

    // console.log(JSON.stringify(root));

    var tags;
    tags = dict.tag('สวัสดีครับผมชื่อพงศธร');
    console.log('tags: ', tags);
    tags = dict.tag('ผมอยู่แถวอโศก');
    console.log('tags: ', tags);
    tags = dict.tag('ผมอยู่แถวอโศกมีอะไรให้ช่วย');
    console.log('tags: ', tags);
    tags = dict.tag('ผมอยู่แถวอโศกสวัสดี');
    console.log('tags: ', tags);
    tags = dict.tag('อโศกสวัสดีครับสวัสดี');
    console.log('tags: ', tags);
}