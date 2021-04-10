module.exports = {
    apps : [{
        script: './bin/www.js',
        watch: '.'
    }],

    deploy : {
        production : {
            user : 'ubuntu',
            host : '37.152.185.234',
            ref  : 'origin/master',
            repo : 'https://jrazi@github.com/jrazi/myinr-backend.git',
            path : '/home/ubuntu/misd/myinr-backend',
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': '',
            "env"  : {
                "NODE_ENV": "production"
            }
        }
    }
};











