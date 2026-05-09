const vscode=require('vscode');
const {
    execCommand,isGitInstalled, hasRemoteOrigin
}=require('./src/gitHelper');
const{
    GitPushSidebarProvider
}=require('./src/gitignoreHelper');

@param {vscode.ExtensionContext} context

function activate(context){
    cosole.log('GitHelper is now active yayaya!');

    const sidebarProvider=new GitPushSidebarProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            GitPushSidebarProvider.viewType,
            sidebarProvider
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('gitpush.pushToGithub',pushToGithub),
        vscode.commands.registerCommand('gitpush.pull',()=>
        runSimpleGitCommand('git pull','pull')
    ),
    vscode.commands.registerCommand('gitpush.commit',quickCommit),
    vscode.commands.registerCommand('gitpush.createGitignore',createGitignore),
    vscode.commands.registerCommand('gitpush.openTerminal',openGitTerminal)
    );
}

async function pushToGitHub(){
    const workspacePath=getWorkspacePath();
    if(!workspacePath) return;

    const gitOk=await isGitInstalled();
    if(!gitOk){
       vscode.window.showErrorMessage(
        'Git is not installed!'
       );
       return;
    }
    const commitMsg = await vsocde.window.showInput({
        prompt:'Enter your commit message',
        placeHolder:'Blah blah blah!',
        validateInput:(val)=>(val.trim()?null:'commt message cannot be empty'),

    });
if(!commitMsg) return;

await vscode.window.withProgress(
    {
        location:vscode.ProgressLocation.Notification,
        title:'$(cloud-upload) GitPush',
        cancellable:false,
    },
    async(progress)=>{
     try{
        progress.report({message:'Initialising repository...',increament:10});
        await execCommand('git init',workspacePath);


     }
    }

)
    
}