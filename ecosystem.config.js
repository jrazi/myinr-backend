module.exports = {
    apps : [{
        script: './bin/www',
        watch: '.'
    }],

    deploy : {
        production : {
            user : 'ubuntu',
            host : 'localhost',
            ref  : 'origin/master',
            repo : 'https://jrazi@github.com/jrazi/myinr-backend.git',
            path : '',
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











