const message = "some message from module.js";

const location = 'Assout'

const myFunc = (name)=>{
    return `welcome to my life ${name}`
}

export { message ,myFunc, location as default };
