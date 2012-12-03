var sys = require('sys');

desc('This is an awesome task.');
task('default', ['cleanupBuild','copyToBuild'], function () {
	var list = new jake.FileList(),
		executer;
	list.include('build/**/*.ts');
	executer = jake.createExec(["tsc "+list.toArray().join(' ')],{breakOnError :false});
	executer.addListener('error', function (msg, code) {
	    fail('Error building: ' + msg, code);  
	});	
	executer.run();
});

task('cleanupBuild',[] ,function(){
	jake.rmRf('build');
});

task('copyToBuild',[],function(){
	jake.cpR('./src/','./build/');
});