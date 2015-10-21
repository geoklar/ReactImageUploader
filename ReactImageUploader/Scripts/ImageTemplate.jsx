var CompanyApp = React.createClass({
        //getInitialState: function() {
        //  return {companylist:this.props.companies};
    //},
        loadCommentsFromServer: function () {
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
            this.loadCommentsFromServer();
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        handleNewRowSubmit: function (newcompany) {
            //var images = this.state.data;
            //var newImages = images.concat([image]);
            //this.setState({ data: newImages });

            var data = new FormData();
            data.append('Name', newcompany.Name);
            data.append('Description', newcompany.Description);
            data.append('File', newcompany.File);

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitUrl, true);
            xhr.onload = function () {
                newcompany.Loader.className = '';
                newcompany.Loader.className = 'loaderRemove';
                this.loadCommentsFromServer();
            }.bind(this);
            xhr.send(data);
          //this.setState( {companylist: this.state.companylist.concat([newcompany])} );
        },
        handleCompanyRemove: function( company ) {
            
        document.getElementById('img_' + company.Id).src = '../Pictures/loader.gif';
        var dt = new FormData();
        dt.append('Name', company.Name);
        dt.append('Id', company.Id);

        var xhr = new XMLHttpRequest();
        xhr.open('post', 'images/delete', true);
        xhr.onload = function () {
            var index = -1;
            var clength = this.state.data.length;
            for (var i = 0; i < clength; i++) {
                if (this.state.data[i].Id === company.Id) {
                    index = i;
                    break;
                }
            }
            this.state.data.splice(index, 1);
            this.setState({ data: this.state.data });
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
                  <CompanyList clist={this.state.companylist} data={this.state.data}  onCompanyRemove={this.handleCompanyRemove}/>
                </td>
                <td style={rightTdStyle}>
                  <NewRow onRowSubmit={this.handleNewRowSubmit}/>
                </td>
              </tr>
          </table>
          );
        }
      });
      
      var CompanyList = React.createClass({
        handleCompanyRemove: function(company){
          this.props.onCompanyRemove( company );
        },
        render: function() {
            var companies = [];
            //var h3Style = { font: '95% Arial,Helvetica,sans-serif;' }
          var that = this;
          var imageNodes = this.props.data.map(function (company) {
              return (
                    <Company company={company} onCompanyDelete={that.handleCompanyRemove} />
                );
          });
            
          return ( 
            <div className="imageBox">
                <h3>Πίνακας Αποθηκευμένων Εικόνων</h3>
              <table className="imageList">
                <thead><tr><th>Α/Α</th><th>Όνομα</th><th>Περιγραφή</th><th>Τοποθεσία</th><th>Διαγραφή</th></tr></thead>
                <tbody>{imageNodes}</tbody>
              </table>
            </div>
            );
        }
      });
      
      var Company = React.createClass({
        handleRemoveCompany: function() {
          this.props.onCompanyDelete( this.props.company );
          return false;
        },
        render: function() {
          return (
            <tr>
              <td>{this.props.company.Id}</td>
              <td>{this.props.company.Name}</td>
              <td>{this.props.company.Description}</td>
              <td>{this.props.company.ImagePath}</td>
              <td className="delete"><img src="../Pictures/delete.png" id={'img_' + this.props.company.Id} onClick={this.handleRemoveCompany} /></td>
              
            </tr>
            );
        }
      });
//<td><input type="button"  className="btn btn-primary" value="Διαγραφή" onClick={this.handleRemoveCompany}/></td>
      var NewRow = React.createClass({
          handleSubmit: function (e) {
              e.preventDefault();
              var name = this.refs.name.getDOMNode().value;
              var description = this.refs.description.getDOMNode().value;
              var loader = this.refs.loader.getDOMNode();
              var imagePath = this.refs.imagePath.files[0];
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
              this.props.onRowSubmit( newrow );
          
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
              </div>
              <div className="input-group input-group-lg" style={inputStyle}>
                <input type="text"  className="form-control col-md-8" placeholder="Όνομα Εικόνας" ref="name"/>
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
  <CompanyApp url="/images" submitUrl="/images/new" pollInterval={600000} />,
  document.getElementById('content')
);