function addition(a,b){
    return a + b;
}

function soustraction(a,b){
    return a - b;
}

function multiplication(a,b){
    return a * b;
}

function div(a,b){
    if (b!== 0)
        return a/b
    else
        return -1
}


module.exports=addition;