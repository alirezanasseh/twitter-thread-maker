const CHL = 280;

/**
 *
 * @param {string} text
 * @param {Array<string>} array
 * @param {"space" | "nl" | "both"} delimiter
 * @param {"none" | "simple" | "complete"} numbered
 * @param {number} count
 * @return {Array<string>}
 */
function makeThread (text, array, delimiter, numbered, count) {
    // handle numbered
    let pre = '';
    switch (numbered) {
        case 'simple':
            pre = count.toString() + ') ';
            break;
        case 'complete':
            pre = count.toString() + '/~~) ';
            break;
    }

    if (text.length <= CHL - pre.length) {
        array.push(pre + text);
        // replacing ~~ to number of tweets
        if (count > 1) {
            array = array.map(item => item.replace('~~', count.toString()));
        }
        return array;
    }

    const sub = pre + text.slice(0, CHL - 1 - pre.length);

    // handle delimiter
    const lastSpace = sub.lastIndexOf(" ");
    const lastNL = sub.lastIndexOf("\n");
    let cutBy = 0;
    switch (delimiter) {
        case 'space':
            cutBy = lastSpace
            break;
        case 'nl':
            cutBy = lastNL;
            break;
        case 'both':
            cutBy = Math.max(lastSpace, lastNL);
            break
    }
    let remain = '';

    // pushing to array and prepare remain
    if (cutBy === 0) {
        array.push(sub);
        remain = text.slice(CHL - 1 - pre.length);
    } else {
        array.push(sub.slice(0, cutBy));
        remain = text.slice(cutBy - pre.length);
    }

    // call recursive
    return makeThread(remain, array, delimiter, numbered, ++count);
}

function handleForm () {
    const text = document.getElementById("text").value;
    const delimiterFields = document.getElementsByName('delimiter');
    let delimiter = 'both';
    for (let i = 0; i < delimiterFields.length; i++) {
         if (delimiterFields[i].checked) {
             delimiter = delimiterFields[i].value;
             break;
         }
    }
    const numberedFields = document.getElementsByName('numbered');
    let numbered = 'none';
    for (let i = 0; i < numberedFields.length; i++) {
         if (numberedFields[i].checked) {
             numbered = numberedFields[i].value;
             break;
         }
    }
    const result = makeThread(text, [], delimiter, numbered, 1);
    document.getElementById("thread").innerText = result.join("\n...\n");
}