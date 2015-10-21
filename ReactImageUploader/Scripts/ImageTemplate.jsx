//Basic component 
var ImageApp = React.createClass({
        loadImagesFromServer: function () {
            var xhr = new XMLHttpRequest();
            xhr.open('get', this.props.url, true);
            xhr.onload = function () {
                var data = JSON.parse(xhr.responseText);
                this.setState({ data: data });
            }.bind(this);
            xhr.send();
        },
        getInitialState: function () {
            return { data: [] };
        },
        componentDidMount: function () {
            this.loadImagesFromServer();
            setInterval(this.loadImagesFromServer, this.props.pollInterval);
        },
        handleNewImageSubmit: function (newimage) {
            var data = new FormData();
            data.append('Name', newimage.Name);
            data.append('Description', newimage.Description);
            data.append('File', newimage.File);

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitUrl, true);
            xhr.onload = function () {
                newimage.Loader.className = '';
                newimage.Loader.className = 'loaderRemove';
                this.loadImagesFromServer();
            }.bind(this);
            xhr.send(data);
        },
        handleImageRemove: function( image ) {
        var dt = new FormData();
        dt.append('Name', image.Name);
        dt.append('Id', image.Id);

        var xhr = new XMLHttpRequest();
        xhr.open('post', 'images/delete', true);
        xhr.onload = function () {
            var index = -1;
            var clength = this.state.data.length;
            for (var i = 0; i < clength; i++) {
                if (this.state.data[i].Id === image.Id) {
                    index = i;
                    break;
                }
            }
            this.state.data.splice(index, 1);
            this.setState({ data: this.state.data });
            document.getElementById('img_loader').className = '';
            document.getElementById('img_loader').className = 'loaderRemove';
        }.bind(this);
        xhr.send(dt);
        },
        render: function() {
          var tableStyle = {width: '100%'};
          var leftTdStyle = {width: '50%',padding:'20px',verticalAlign: 'top'};
          var rightTdStyle = {width: '50%',padding:'20px',verticalAlign: 'top'};
          return ( 
            <table style={tableStyle}>
              <tr>
                <td style={leftTdStyle}>
                  <ImageList data={this.state.data}  onImageRemove={this.handleImageRemove}/>
                </td>
                <td style={rightTdStyle}>
                  <NewRow onImageSubmit={this.handleNewImageSubmit}/>
                </td>
              </tr>
          </table>
          );
        }
      });
      
//ImageApp sub-component 
    var ImageList = React.createClass({
        handleImageRemove: function (image) {
            //Make Table loader image visible until image row is deleted 
            document.getElementById('img_loader').className = '';
            document.getElementById('img_loader').className = 'loaderAdd';
              this.props.onImageRemove(image);
        },
        render: function() {
          var that = this;
          var imageNodes = this.props.data.map(function (image) {
              return (
                    <Image image={image} onImageDelete={that.handleImageRemove} />
                );
          });
            
          return ( 
            <div className="imageBox">
                <h3>Πίνακας Αποθηκευμένων Εικόνων</h3>
              <table className="imageList">
                <thead><tr><th></th><th>Α/Α</th><th>Όνομα</th><th>Περιγραφή</th><th>Τοποθεσία</th><th>Διαγραφή</th></tr></thead>
                <tbody>{imageNodes}</tbody>
              </table>
                <div style={{ textAlign: 'right' }}>
                    <img src="../Pictures/loader.gif" style={{marginRight: '28px'}} id="img_loader" className="loaderRemove" />
                </div>
            </div>
            );
        }
      });
     
//ImageList sub-component 
      var Image = React.createClass({
        handleRemoveImage: function() {
          this.props.onImageDelete( this.props.image );
          return false;
        },
        render: function () {
            var bgImage = { width: '50px', height: '50px' };
            var bgTdImage = { minWidth: '50px', minHeight: '50px', padding: '0px' };
          return (
            <tr>
              <td style={bgTdImage}><img style={bgImage} src={this.props.image.ImagePath}/></td>
              <td>{this.props.image.Id}</td>
              <td>{this.props.image.Name}</td>
              <td>{this.props.image.Description}</td>
              <td><a target="_blank" href={this.props.image.ImagePath}>{this.props.image.ImagePath}</a></td>
              <td className="delete"><img src="../Pictures/delete.png" onClick={this.handleRemoveImage} /></td>
              
            </tr>
            );
        }
      });

//ImageApp sub-component for adding new entries
      var NewRow = React.createClass({
          handleSubmit: function (e) {
              e.preventDefault();
              var name = this.refs.name.getDOMNode().value;
              var description = this.refs.description.getDOMNode().value;
              var loader = this.refs.loader.getDOMNode();
              var imagePath = this.refs.imagePath.files[0];
              var ext = this.refs.imagePath.value.split('.').pop().toLowerCase();
              if (!name || !imagePath) {
                  if (!name && !imagePath)
                      alert("Παρακαλώ επιλέξτε αρχείο και εισάγετε το όνομα του.");
                  else if (!name)
                      alert("Παρακαλώ πληκτρολογήστε το όνομα του αρχείου.");
                  else if (!imagePath)
                      alert("Παρακαλώ επιλέξτε ένα αρχείο.");

                  return;
              }
              var newrow = { Name: name, Description: description, File: imagePath, Loader: loader };
              this.props.onImageSubmit( newrow );
          
              this.refs.name.getDOMNode().value = '';
              this.refs.description.getDOMNode().value = '';
              this.refs.imagePath.getDOMNode().value = '';
              this.refs.loader.getDOMNode().className = 'loaderAdd';
              return;
        },
        render: function() {
          var inputStyle = {padding:'12px'}
          return ( 
            <div className="well">
              
            <form className="imageForm" onSubmit={this.handleSubmit}>
                <h3>Προσθήκη Αρχείου Εικόνας</h3>
              <div className="input-group input-group-lg" style={inputStyle}>
                <input type="file" className="form-control col-md-8" placeholder="Επιλέξτε αρχείο εικόνας" ref="imagePath" />
                  <span className="form-required">*</span>
              </div>
              <div className="input-group input-group-lg" style={inputStyle}>
                <input type="text"  className="form-control col-md-8" placeholder="Όνομα Εικόνας" ref="name"/>
                  <span className="form-required">*</span>
              </div>
              <div className="input-group input-group-lg" style={inputStyle}>
                <input type="text"  className="form-control col-md-8" placeholder="Περιγραφή Εικόνας" ref="description"/>
              </div>
              <div className="input-group input-group-lg" style={inputStyle}>
                <input type="submit"  className="btn btn-primary" value="Προσθήκη Εικόνας"/>
                <img src="../Pictures/loader.gif" ref="loader" className="loaderRemove" />
              </div>
            </form>
            </div>
            );
        }
      });

React.render(
  <ImageApp url="/images" submitUrl="/images/new" pollInterval={60000} />,
  document.getElementById('content')
);