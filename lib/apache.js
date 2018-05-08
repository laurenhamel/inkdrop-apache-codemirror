'use babel';

module.exports = {

  activate() {

    const CodeMirror = require('codemirror');

    CodeMirror.defineMode("apache", () => {

      return {

        token(stream, state) {

          let sol = stream.sol() || state.afterSection;
          let eol = stream.eol();

          state.afterSection = false;

          if (sol) {

            if (state.nextMultiline) {

              state.inMultiline = true;
              state.nextMultiline = false;

            }

            else {

              state.position = "def";

            }

          }

          if (eol && !state.nextMultiline) {

            state.inMultiline = false;
            state.position = "def";

          }

          if (sol) {

            while (stream.eatSpace()) {}

          }

          var ch = stream.next();

          if (sol && ch === "#") {

            state.position = "comment";

            stream.skipToEnd();

            return "comment";

          }

          else if (ch === " ") {

            state.position = "variable";

            //return null;

          }

          else if (ch === '"') {

            // Quote found on this line
            if (stream.skipTo('"')) {

              // Skip quote
              stream.next();

            }

            else {

              // Rest of line is string
              stream.skipToEnd();

            }

            state.position = "quote";
          }

          else if (ch === '<' || ch === '>') {

            state.position = "def";
          }

          return state.position;

        },

        startState() {

          return {
            position: "def", // Current position, "def", "quote" or "comment"
            nextMultiline: false, // Is the next line multiline value
            inMultiline: false, // Is the current line a multiline value
            afterSection: false // Did we just open a section
          };

        }

      };

    });

    CodeMirror.defineMIME('text/x-apache', 'apache');

    CodeMirror.modeInfo.push({
      name: 'apache',
      mime: 'text/x-apache',
      mode: 'apache',
      ext: ['apache'],
      alias: []
    });

  },

  deactivate() {}

};
