var sys = require('sys');
var exec = require('child_process').exec;


desc('This is an awesome task.');
task('default', ['cleanupBuild','copyToBuild'], function () {
	var list = new jake.FileList();
	list.include('build/**/*.ts');
	exec("tsc "+list.toArray().join(' '), function(error, stdout, stderr){
			console.log(stdout);
			console.log(stderr);
			console.log("\nProcess ended\n "+error.stack);
	});
});

task('cleanupBuild',[] ,function(){
	jake.rmRf('build');
});

task('copyToBuild',[],function(){
	jake.cpR('./src/','./build/');
});