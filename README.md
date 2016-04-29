<p align="center">
  <img src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/63ad8636649301.5723a7da52a6d.png" />
</p>

## Requirement

- AWS
- APEX

...WIP

## Development

fork repository

```sh
$ git clone https://github.com/kidark/little-boy.git
$ cd little-boy 
```

```sh
$ npm install
```

```sh
$ apex infra get -e dev
$ apex infra plan -e dev
$ apex infra apply -e dev
```

copy & paste `lambda_function_role_arn` to your project.json role field.

```sh
$ apex deploy main -r us-east-1
```

```sh
$ echo -n '{"foo":"bar"}' | apex invoke main -r us-east-1
```

```sh
$ apex logs main -r us-east-1
```

## Contribution