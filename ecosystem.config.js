module.exports = {
    apps : [{
        script: './bin/www',
        watch: '.',
        "log_type": "json",
    }],

    deploy : {
        production : {
            user : 'ubuntu',
            host : 'localhost',
            ref  : 'origin/master',
            repo : 'git@github.com:jrazi/myinr-backend.git',
            path : '/pm2deploy',
            'pre-deploy-local': '',
            'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': '',
            "env"  : {
                "NODE_ENV": "production",
                "NODE_OPTIONS": "--tls-min-v1.0",
            }
        }
    }
};











