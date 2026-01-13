export function generatePromoCode(prefix = 'b', length = 20) {
    let promoCode = prefix;
    for(let i = 0; i < length; i++) {
        promoCode += Math.floor(Math.random() * 10);
    }
    return promoCode;
}