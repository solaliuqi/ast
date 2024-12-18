// const hello = ()=>{}
// 修改函数名称
// 如何babel插件：hello=>world

const parser = require('@babel/parser')
const traverse = require('@babel/traverse')
const generator = require('@babel/generator')

const hello = ()=>{}

const changeName = (code)=>{
    const ast = parser.parse(code)
    const visitor = {
        Identifier(path) {
            console.log('name',path)
            if (path.node.name === 'hello') {
                path.node.name = 'world'
            }
        }
    }

    traverse.default(ast,visitor)

    // traverse.default(ast,{
    //     enter(path){
    //         if(path.isIdentifier({name:'hello'})){
    //             path.node.name = 'world'
    //         }
    //     }
    // })

    return generator.default(ast,{},code ).code
}
``
const code = `const hello = ()=>{}`

console.log(changeName(code))