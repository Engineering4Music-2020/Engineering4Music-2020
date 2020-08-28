import * as shell from "shelljs";

shell.mkdir("-p", "dist/public");
shell.cp("-R", "src/public/css", "dist/public/css/");
shell.cp("-R", "src/public/images", "dist/public");
shell.cp("-R", "src/public/js", "dist/public/js");
