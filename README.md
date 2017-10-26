# Ninjagoat-projections

An easy way for the viewmodels to access a [prettygoat](https://github.com/tierratelematics/prettygoat) instance and it's projections.
This module makes a connection via socket.io to receive realtime notifications from the projection engine and fetches automatically the new data.

## Installation

`
$ npm install ninjagoat-projections
`

Add this code to the bootstrapper.ts file:

```typescript
import {ProjectionsModule} from "ninjagoat-projections"

application.register(new ProjectionsModule());
```

Point to the notifications endpoint of a prettygoat instance in one your modules .

```typescript
import {ISocketConfig} from "ninjagoat-projections";

container.bind<ISocketConfig>("ISocketConfig").toConstantValue({
    "endpoint": "your_prettygoat_instance"
});
```

## Usage

The data of a given projection can be retrieved by using a specific service: ModelRetriever.
This service returns an Observable of type ModelState<T>, where ModelState is a tuple to carry model and phase of the data(loading, content ready or failed).

```typescript
let modelRetriever = serviceLocator.get<IModelRetriever>("IModelRetriever");

//To access the data of a projection named List registered in a Users area
let source = modelRetriever.controllerFor({
    area: "Users",
    viewmodelId: "List"
}).model;
```

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
