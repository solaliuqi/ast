const core = require('@babel/core');

//实现插件：将箭头函数转位普同函数
// const sum = (a,b)=>{return a+b}


let sourceCode = `
const sum = (a,b) => {
    console.log(this)
    return a+b
}`

// this的处理
function hoistFunctionEnvironment(path){
    const thisEnv = path.findParent((parent)=>{
        return (
            (parent.isFunction() && !parent.isArrowFunction()) || parent.isProgram()
        )
    });

    //作用于：scope
    thisEnv.scope.push({
        id:core.types.identifier('_this'),
        init:core.types.thisExpression(),
    })

    //存储this路径
    const thisPaths=[]

    path.traverse({
        ThisExpression(thisPath){
            thisPaths.push(thisPath)
        }
    })

    //替换this
    thisPaths.forEach((thisPath)=>{
        thisPath.replaceWith(core.types.identifier('_this'))
    })
}

const myPlugin = {
    visitor:{
        Identifier:(path)=>{
            if(path.node.name === 'sum'){
                path.node.name = 'hello'
            }
        },
        ArrowFunctionExpression:(path)=>{
            if(path.node.type === 'ArrowFunctionExpression'){
                path.node.type = 'FunctionExpression'
            }
            hoistFunctionEnvironment(path)
            if(!core.types.isBlockStatement(path.node)){
                //生成作用域名
                path.node.body = core.types.blockStatement([core.types.returnStatement(path.node.body)])
            }
        }
    }
}

let targetSource = core.transform(sourceCode,{
    plugins:[myPlugin]
})

console.log(targetSource.code)



