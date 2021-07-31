module.exports = {
    apps : [{
        name: 'myinr',
        script: './bin/www',
        watch: '.',
        log_type: "json",
        env_development: {
            "NODE_ENV": "development",
            "NODE_OPTIONS": "--tls-min-v1.0",
            "PORT": 3000,
        },
        env_production: {
            "NODE_ENV": "production",
            "NODE_OPTIONS": "--tls-min-v1.0",
            "PORT": 3000,
        }
    }],

    deploy : {
        production : {
            user : 'ubuntu',
            host : 'localhost',
            ref  : 'origin/master',
            repo : 'git@github.com:jrazi/myinr-backend.git',
            path : '/home/ubuntu/myinr/deployed',
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











