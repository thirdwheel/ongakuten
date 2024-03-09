exports.jsToStr=function(fCode)
{
    if (typeof fCode !== 'function')
    {
        return "/* the developer is a dummy who doesn't know how to use this function! */";
    }
    let sCode=fCode.toString();
    return sCode.slice(sCode.indexOf('{')+1, -1);
}