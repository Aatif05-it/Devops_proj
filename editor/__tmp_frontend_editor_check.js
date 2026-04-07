
        var textarea = document.getElementById('htmlInput');
        var lineNumbers = document.getElementById('lineNumbers');
        var output = document.getElementById('output');
        var sizeInfo = document.getElementById('size-info');
        var runButton = document.querySelector('.btn-run');

        var defaultCode = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<title>Page Title</title>',
            '</head>',
            '<body>',
            '',
            '<h1>This is a Heading</h1>',
            '<p>This is a paragraph.</p>',
            '',
            '</body>',
            '</html>'
        ].join('\n');

        window.updateLineNumbers = function() {
            if (!textarea) return;
            var lines = textarea.value.split('\n').length;
            var lineNum = '';
            for (var i = 1; i <= lines; i++) {
                lineNum += i + '\n';
            }
            if (lineNumbers) lineNumbers.textContent = lineNum;
            if (lineNumbers) lineNumbers.scrollTop = textarea.scrollTop;
        };

        window.updatePreview = function() {
            if (!output || !textarea) return;
            try {
                output.srcdoc = textarea.value;
            } catch (e) {
                console.error('Preview error:', e);
            }
        };

        window.updateSize = function() {
            if (!output || !sizeInfo) return;
            var rect = output.getBoundingClientRect();
            sizeInfo.textContent = Math.round(rect.width) + ' × ' + Math.round(rect.height);
        };

        function init() {
            if (textarea) {
                textarea.value = defaultCode;
                updateLineNumbers();
                updatePreview();
                updateSize();

                textarea.addEventListener('input', function() {
                    updateLineNumbers();
                    updatePreview();
                    updateSize();
                });

                textarea.addEventListener('scroll', function() {
                    if (lineNumbers) {
                        lineNumbers.scrollTop = textarea.scrollTop;
                    }
                });
            }

            if (runButton) {
                runButton.addEventListener('click', function() {
                    updatePreview();
                    updateSize();
                });
            }

            window.addEventListener('resize', updateSize);
        }

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // Also update on window load
        window.addEventListener('load', function() {
            updateSize();
        });
    
