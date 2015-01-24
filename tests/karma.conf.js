module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai'],


        port:9876,
        colors:true,
        dieOnError:false,


        browsers: ['PhantomJS'],

        logLevel: config.LOG_ERROR



    });
};
