module.exports = {
    apps : [{
        script: './bin/www.js',
        watch: '.'
    }],

    deploy : {
        production : {
            user : 'SSH_USERNAME',
            host : 'localhost',
            ref  : 'origin/master',
            repo : 'GIT_REPOSITORY',
            path : '~/misd/myinr-backend/',
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};











