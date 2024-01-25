const spellMoney = (money: number): string => {
    const moneyFloor = Math.floor(Math.abs(money));
    
    var moneyDivideValue = 0;
    var number = [
        '',
        'Satu',
        'Dua',
        'Tiga',
        'Empat',
        'Lima',
        'Enam',
        'Tujuh',
        'Delapan',
        'Sembilan',
        'Sepuluh',
        'Sebelas',
    ];
    var temp = '';
    
    if (moneyFloor < 12) {
        temp = ' ' + number[moneyFloor];
    } else if (moneyFloor < 20) {
        temp = spellMoney(Math.floor(moneyFloor - 10)) + ' Belas';
    } else if (moneyFloor < 100) {
        moneyDivideValue = Math.floor(moneyFloor / 10);
        temp = spellMoney(moneyDivideValue) + ' Puluh' + spellMoney(moneyFloor % 10);
    } else if (moneyFloor < 200) {
        temp = ' Seratus' + spellMoney(moneyFloor - 100);
    } else if (moneyFloor < 1000) {
        moneyDivideValue = Math.floor(moneyFloor / 100);
        temp = spellMoney(moneyDivideValue) + ' Ratus' + spellMoney(moneyFloor % 100);
    } else if (moneyFloor < 2000) {
        temp = ' Seribu' + spellMoney(moneyFloor - 1000);
    } else if (moneyFloor < 1000000) {
        moneyDivideValue = Math.floor(moneyFloor / 1000);
        temp = spellMoney(moneyDivideValue) + ' Ribu' + spellMoney(moneyFloor % 1000);
    } else if (moneyFloor < 1000000000) {
        moneyDivideValue = Math.floor(moneyFloor / 1000000);
        temp = spellMoney(moneyDivideValue) + ' Juta' + spellMoney(moneyFloor % 1000000);
    } else if (moneyFloor < 1000000000000) {
        moneyDivideValue = Math.floor(moneyFloor / 1000000000);
        temp =
        spellMoney(moneyDivideValue) + ' Miliar' + spellMoney(moneyFloor % 1000000000);
    } else if (moneyFloor < 1000000000000000) {
        moneyDivideValue = Math.floor(moneyFloor / 1000000000000);
        temp = spellMoney(moneyFloor / 1000000000000) + ' Triliun' + spellMoney(moneyFloor % 1000000000000);
    }
    
    return temp;
}

export { spellMoney }