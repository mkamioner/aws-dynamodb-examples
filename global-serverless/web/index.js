
getCookiesForList();

function getColors () {
    return [ 'lavender','papayawhip', 'paleturquoise', 'palegoldenrod', 'pink', 'ivory', 'bisque', 'mintcream',  'cornsilk', 'honeydew', 'oldlace', 'plum', 'palegreen', 'thistle', 'paleturquoise'];

}

function getSampleItemKeys() {
    return({
        'Keys': {
            'PK': 'user100',
            'SK': 'AshlandValley'
        }
    });
}

async function callApi(cookie, api, index) {

    const colorPalette = getColors();
    const color=colorPalette[index];

    let latencyCell = document.getElementById(cookie + '-latency');

    const started = new Date().getTime();
    // document.getElementById('hg' + index).style.visibility = 'visible';

    const response = await fetch(api);

    if(response.ok) {
        const ended = new Date().getTime();
        const latency = ended - started;

        let data = await response.json();

        let LambdaLatency = data?.Latency;

        latencyCell.innerHTML = '<span class="latency">'
            + (LambdaLatency ?  LambdaLatency + ' ms Lambda-to-DynamoDB,<br/>' : '') +  latency + ' ms from browser'
            + '</span>';

        const results = document.getElementById('results');
        // const res = document.getElementById('res');

        const row0 = results.insertRow(0);

        for(let i=0; i < index; i++) {
            const cell0 = row0.insertCell(-1);
            cell0.className = "tablenull";
        }
        const cell1 = row0.insertCell(-1);
        cell1.className = "tablenull";

        let res = document.createElement('table');
        cell1.appendChild(res);

        if('Items' in data || 'Item' in data) {

            let items = [];
            if('Item' in data) {
                items = [data.Item];
            } else {
                items = data.Items;
            }

            const row0 = res.insertRow(0);

            const cell0 = row0.insertCell(-1);
            cell0.className = "tablenull";
            cell0.innerHTML = '&nbsp;';

            if(items) {

                items.forEach((item) => {

                    let attrs = Object.keys(item);
                    attrs.sort((a,b) => {
                        const aScore = a === 'PK' ? 2 : a === 'SK' ? 1 : 0;
                        const bScore = b === 'PK' ? 2 : b === 'SK' ? 1 : 0;
                        return (bScore - aScore);
                    });

                    const row = res.insertRow(0);


                    attrs.forEach(attr => {
                        const cell1 = row.insertCell(-1);
                        cell1.className = "dataheader";
                        cell1.style="background-color:" + colorPalette[index];
                        cell1.innerHTML = '<div>' + attr + '<div class="datavalue">' + item[attr][Object.keys(item[attr])[0]] + '</div></div>';

                    });

                });

            }

        } else {

            if('Attributes' in data && 'Bookmark' in data['Attributes']) {

                const row0 = res.insertRow(0);
                const row = res.insertRow(0);

                const cell1 = row.insertCell(-1);
                cell1.className = "dataheader";
                cell1.style="background-color:" + colorPalette[index];
                const PK =  data['PK'];
                cell1.innerHTML = '<div>PK<div class="datavalue">' + PK + '</div></div>';

                const cell2 = row.insertCell(-1);
                cell2.className = "dataheader";
                cell2.style="background-color:" + colorPalette[index];
                const SK =  data['SK'];
                cell2.innerHTML = '<div>SK<div class="datavalue">' + SK + '</div></div>';


                const cell3 = row.insertCell(-1);
                cell3.className = "dataheader";
                cell3.style="background-color:" + colorPalette[index];
                const bookmark =  data['Attributes']['Bookmark'];
                cell3.innerHTML = '<div>Bookmark<div class="datavaluenew">' + bookmark[Object.keys(bookmark)[0]] + '</div></div>';

                const cell9 = row0.insertCell(-1);
                cell9.className = "tablenull";
                cell9.innerHTML = '&nbsp;';

            } else {

                if('Error' in data) {
                    console.error(data.Error);
                    latencyCell.innerHTML = '<span class="error">Error</span>';
                } else {
                    // console.log(JSON.stringify(data, null, 2))
                }
            }

        }

    } else {
        latencyCell.innerHTML = '<span class="error">HTTP ' + response.status + '</span>';
        // console.log('HTTP-Error: ' + response.status)
    }

    // document.getElementById('hg' + index).style.visibility = 'hidden';

}


function getCookiesForList() {

    const sampleItem = getSampleItemKeys();

    const demo_item_pk = sampleItem.Keys.PK;
    const demo_item_sk = sampleItem.Keys.SK;

    const cookieObj = document.cookie.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        prev[name] = value.join('=');
        return prev;
    }, {});

    const table = document.getElementById('list');
    const debug = document.getElementById('debug');

    const colorPalette = getColors();

    table.innerHTML = '';

    const rs = table.insertRow(0);
    const cs = rs.insertCell(-1);
    const cs2 = rs.insertCell(-1);
    const cs3 = rs.insertCell(-1);

    // cs3.innerHTML = "<button class='runall' >RUN ALL</button>";

    Object.keys(cookieObj).forEach((cookie, index)=>{

        if(cookie !== "") {
            const row = table.insertRow(-1);

            const cell2 = row.insertCell(-1);
            cell2.className = "tabledata";
            cell2.style="background-color:" + colorPalette[index];

            cell2.innerHTML = cookieObj[cookie].split('.')[2] + '<br/>' + cookieObj[cookie].split('.')[0]

            const cell3 = row.insertCell(-1);
            cell3.className = "tabledata";
            cell3.style="background-color:" + colorPalette[index];
            cell3.innerHTML = "<button onClick=eraseCookie('"+cookie+"')>X</button>"

            const cell4 = row.insertCell(-1);
            cell4.className = "tabledata";
            cell4.style="background-color:" + colorPalette[index];
            cell4.innerHTML = "<button class='go' onClick=callApi('" + cookie + "','" + cookieObj[cookie] + "','"+index.toString()+"')>ping</button>";

            const cell5 = row.insertCell(-1);
            cell5.className = "tabledata";
            cell5.style="background-color:" + colorPalette[index];
            cell5.innerHTML = "<button class='go' onClick=callApi('" + cookie + "','" + cookieObj[cookie] + "get/" + demo_item_pk + "/" + demo_item_sk + "','"+index.toString()+"')>get-item</button>";

            const cell6 = row.insertCell(-1);
            cell6.className = "tabledata";
            cell6.style="background-color:" + colorPalette[index];
            cell6.innerHTML = "update<br/>bookmark:";

            const cell7 = row.insertCell(-1);
            cell7.className = "tabledata";
            cell7.style="background-color:" + colorPalette[index];
            cell7.innerHTML = "<button class='gobig' onClick=callApi('" + cookie + "','" + cookieObj[cookie] + "update/" + demo_item_pk + "/" + demo_item_sk + "/-1','"+index.toString()+"')>&lt;&lt;</button>&nbsp;<button class='gobig' onClick=callApi('" + cookie + "','" + cookieObj[cookie] + "update/" + demo_item_pk + "/" + demo_item_sk + "/1','"+index.toString()+"')>&gt;&gt;</button>";


            const cell8 = row.insertCell(-1);
            cell8.innerHTML = '<span class="hourglass" id="hg' + table.rows.length + '" >⌛</span>';

            const cell9 = row.insertCell(-1);
            cell9.id = cookie + '-latency';

        }


    });

}

function setCookie(value) {
    let days = 1000;
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }

    let region = 'us-west-2'; // will be reset

    let amazonDomainPos = value.search('amazonaws.com');
    if(amazonDomainPos > 0) {
        let prefix = value.slice(0, amazonDomainPos-1);

        region = prefix.slice(prefix.lastIndexOf('.') + 1);
    }

    // let cookieName = prompt("API Name", region);
    let cookieName = region;

    if(cookieName && cookieName.length > 0) {
        document.cookie = cookieName + "=" + (value || "")  + expires + "; path=/";
    }

    getCookiesForList();
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)===' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
    getCookiesForList();
}
