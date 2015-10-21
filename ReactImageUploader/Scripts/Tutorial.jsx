var ImageList = React.createClass({
    loadImgFromServer: function (image) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/images', true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleImageDelete: function (image) {
        //var images = this.state.data;
        //var newImages = images.concat([image]);
        //this.setState({ data: newImages });
        document.getElementById('img_' + image.Id).src = '../Pictures/loader.gif';
        var dt = new FormData();
        dt.append('Name', image.Name);
        dt.append('Id', image.Id);
        this.setState({ data: [] });
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'images/delete', true);
        xhr.onload = function () {
            //document.getElementById('img_' + image.Id).src = '../Pictures/delete.png';
            this.loadImgFromServer();
        }.bind(this);
        xhr.send(dt);
    },
    render: function () {
        var delHandle = this;
      var imageNodes = this.props.data.map(function (image) {
      return (
        <tr name={image.Name}>
            <td>{image.Id}</td>
            <td>{image.Name}</td>
            <td>{image.Description}</td>
            <td><a target="_blank" href={image.ImagePath}>{image.ImagePath}</a></td>
            <td className="delete"><img src="../Pictures/delete.png" id={'img_' + image.Id} onClick={delHandle.handleImageDelete.bind(this,image)}/></td>
        </tr>
      );
    });
    return (
      <table className="imageList">
          <thead>
            <th>Α/Α</th>
            <th>Όνομα</th>
            <th>Περιγραφή</th>
            <th>Τοποθεσία</th>
            <th>Διαγραφή</th>
          </thead>
          <tbody>
              {imageNodes}
          </tbody>
      </table>
    );
  }
});

var ImageBox = React.createClass({
    loadImagesFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleImageSubmit: function (image) {
        //var images = this.state.data;
        //var newImages = images.concat([image]);
        //this.setState({ data: newImages });

        var data = new FormData();
        data.append('Name', image.Name);
        data.append('Description', image.Description);
        data.append('File', image.File);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            image.Loader.className = '';
            image.Loader.className = 'loaderRemove';
            this.loadImagesFromServer();
        }.bind(this);
        xhr.send(data);
        
    },
    getInitialState: function () {
        return { data: [] };
    },
    componentDidMount: function () {
        this.loadImagesFromServer();
        window.setInterval(this.loadImagesFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
          <div className="imageBox">
            <h1>Πίνακας Αποθηκευμένων Εικόνων</h1>
            <ImageList data={this.state.data} />
            <ImageForm onImageSubmit={this.handleImageSubmit} />
          </div>
      );
    }
});

var Image = React.createClass({
    render: function() {
        var converter = new Showdown.converter();
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
          
        {__html: rawMarkup}
    );
}
});

var ImageForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.refs.name.getDOMNode().value.trim();
        var description = this.refs.description.getDOMNode().value.trim();
        var loader = this.refs.loader.getDOMNode();
        var file = this.refs.imagePath.files[0];
        if (!name || !file) {
            if (!name && !file)
                alert("Παρακαλώ επιλέξτε αρχείο και εισάγετε το όνομα του.");
            else if(!name)
                alert("Παρακαλώ πληκτρολογήστε το όνομα του αρχείου.");
            else if(!file)
                alert("Παρακαλώ επιλέξτε ένα αρχείο.");
            
            return;
        }
        // TODO: send request to the server
        this.props.onImageSubmit({ Name: name, Description: description, File: file, Loader: loader });
        this.refs.name.getDOMNode().value = '';
        this.refs.description.getDOMNode().value = '';
        this.refs.imagePath.getDOMNode().value = '';
        this.refs.loader.getDOMNode().className = 'loaderAdd';
        return;
    },
    render: function() {
        return (
          <form className="imageForm" onSubmit={this.handleSubmit}>
            <input type="file" placeholder="Επιλέξτε αρχείο εικόνας" ref="imagePath"/>
              <label className="imageLabel">*</label>
              <br />
            <input type="text" placeholder="File name" ref="name" />
              <label className="imageLabel">*</label>
              <br />
            <input type="text" placeholder="File description" ref="description"/>
              <br />
            <input type="submit" value="Αποστολή" />
            <img src="../Pictures/loader.gif" ref="loader" className="loaderRemove"/>
          </form>
      );
    }
});

React.render(
  <ImageBox url="/images" submitUrl="/images/new" pollInterval={600000} />,
  document.getElementById('content')
);