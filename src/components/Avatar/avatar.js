import React from 'react'

// const colors = ['#0b5155', '#0a42de', "#0ccd57", "#06b4f6", "#02f1c8", "#0a2f3a", "#045b4c", "#076878", "#0b472b", "#042103", "#0395ce", "#072d39", "#03a7d8", "#0127f4", "#090a29", "#063e57", "#0520e8", "#09b336", "#0c5510", "#0addb3", "#0d8b48", "#069f34", "#088fb9", "#0f244b", "#03db4a", "#010161", "#0edef8", "#04e0c6", "#02f3be", "#0bb37e", "#0ab8a6", "#087748", "#0609a9", "#0dd49f", "#0107be", "#0550ae", "#0686ab", "#02892b", "#0a24a3", "#0b3fd5", "#0260d9", "#0a9a91", "#02478a", "#0567df", "#097365", "#00c2eb", "#028e6b", "#09b864", "#017644", "#07f5aa", "#0de7a6", "#0ad04b", "#0d1db8", "#076ae2", "#01e806", "#0e5571", "#0ce1a6", "#06b5a4", "#074737", "#07c22c", "#0a6247", "#049cf3", "#076e3d", "#0bf478", "#073912", "#09f768", "#0dc1cb", "#0c7b08", "#02c75d", "#0760fa", "#017f2e", "#00c251", "#0a7ad5", "#0e9bcc", "#0abedb", "#0eb3b9", "#071c7f", "#01e288", "#08f426", "#05a61d", "#06f3bc", "#01259e", "#04db3d", "#004bfe", "#0ac0dd", "#04f224", "#0c682c", "#0e8a24", "#00ee2f", "#0da822", "#0a271b"]
// const colors = ['#fd9401', 'rgb(230, 0, 126)', '#0b0e21', '#62829a']
const colors = ['rgb(11, 14, 33)', 'rgb(230, 0, 126)']
export function LetterAvatar(props) {
    const { letter, rounded, className } = props;

    function getFirstTwoLetters() {
        const strArr = letter.split(" ");
        let letterToReturn = [];
        if (strArr.length >= 2) {
            letterToReturn.push(strArr[0].charAt(0));
            letterToReturn.push(strArr[1].charAt(0));
        } else {
            letterToReturn.push(strArr[0].charAt(0));
            letterToReturn.push(strArr[0].charAt(1));
        }
        return letterToReturn.join("");
    }

    const returnRandomNum = (Limit) => {
        return Math.floor(Math.random() * Limit) + 1
    }

    return (
        <div className={className ? className : ''} style={{
            backgroundColor: colors[returnRandomNum(colors.length - 1)],
            width: '45px',
            height: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            borderRadius: rounded  ? '50px' : '5px',

        }}>
            <h2 style={{ fontSize: '22px'}}>{getFirstTwoLetters()}</h2>
        </div >
    )
}