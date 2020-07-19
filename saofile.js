const download = require('download-git-repo');
const path = require('path');

const downloadTemplate = () => {
  return new Promise((resolve, reject) => {
    console.log('Downloading Specless Framework...');
    const templateFolder = path.resolve(__dirname, 'template');
    download('specless/framework', templateFolder, (err) => {
        console.log(err ? 'Error Downloading Specless Framework' : 'Success Downloading Specless Framework')
        resolve();
    });
  })
}

module.exports = {
  async prompts() {
    console.log(this);
    await downloadTemplate();
    return [
      {
        name: 'type',
        message: 'What kind of project do you want to create?',
        default: 'Creative Template',
        options: ['Creative Template', 'Ad Placement'],
        filter: val => {
          if (val === 'Creative Template') {
            return 'template'
          } else {
            return 'placement'
          }
        }
      },
      {
        name: 'name',
        message: `Please provide a name for this project:`,
        default: this.outFolder,
        filter: val => val.toLowerCase()
      },
      {
        name: 'description',
        message: 'How would you descripe the new project',
        default: `A Specless creative template.`
      },
      {
        name: 'username',
        message: 'What is your GitHub username',
        default: this.gitUser.username || this.gitUser.name,
        filter: val => val.toLowerCase(),
        store: true
      },
      {
        name: 'email',
        message: 'What is your email?',
        default: this.gitUser.email,
        store: true
      }
    ]
  },
  actions: [
    {
      type: 'add',
      files: '**'
    },
    {
      type: 'move',
      patterns: {
        gitignore: '.gitignore'
      }
    }
  ],
  async completed() {
    console.log(this);
    this.gitInit()
    await this.npmInstall()
    this.showProjectTips()
  }
}
