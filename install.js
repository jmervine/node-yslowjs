if (process.platform === 'win32') {
    require('fs').readFile('./NOTES.mdown', 'utf8', function(err, data) {
        console.log(data);
        process.exit(0);
    });
} else {
    require('child_process')
        .spawn('./scripts/install.sh', [], { stdio: 'inherit', env: process.env });
}
