<p align="center"><img src="https://raw.githubusercontent.com/siokas/siokas.github.io/master/img/stacksearch-logo.png" width="256"></p>

Stacksearch is a [Deno](https://deno.land) script that lets developers search through Stack Overflow from the terminal. In order to run or install stacksearch you need to have deno installed in your machine.
It is completely written in typescript which is supported in deno out of the box.  

## Installation

> You may need to pass the --allow-net flag

Run without installation
```sh
deno --allow-net https://raw.githubusercontent.com/siokas/stacksearch/master/mod.ts YOUR_QUESTION_GOES_HERE
```

Install script locally
```sh
deno install --allow-net stacksearch https://raw.githubusercontent.com/siokas/stacksearch/master/mod.ts 
```

(after installation you may want to add the stacksearch folder to your path in order to run the script like "stacksearch YOUR_QUESTION_GOES_HERE")

## Usage example

To run the script just pass the -q parameter with your questions and the stackexchange api will reply with all questions matching yours. 
Enter the number of the question which you want to display the answers. To stop the script type __exit__ or __close__.  

## Development setup

Thanks to [Deno](https://deno.land/) we do not care about the installation or configuration of dependencies. 
Assuming that you already have installed deno in your machine, just clone or download the repo and run deno command in mod.ts file.

## Used

* [Deno](https://deno.land)
* [Deno STD Libraries](https://deno.land/std/)
* [StackExchange API](https://api.stackexchange.com/docs)
* [CLI Spinners for Deno](https://github.com/ameerthehacker/cli-spinners)
* [FlatIcon](https://www.flaticon.com/) for the logo 

## Release History

* 0.1.0
    * Initial Commit

## Meta

Apostolos Siokas – [@siokas_](https://twitter.com/siokas_) – apostolossiokas@gmail.com

## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

Distributed under the [MIT License](https://github.com/siokas/stacksearch/blob/master/LICENSE). 

[https://github.com/siokas/stacksearch](https://github.com/siokas/stacksearch)