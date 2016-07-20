/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


  var fee_data;
  var tax_data;
  var prop_data;
  var fee_file;
  var tax_file;
  var prop_file;
 


  
//adding button listeners
{ 
if(window.addEventListener)
{
                window.addEventListener("load", init, false);
} 
else if(window.attachEvent)
{
                window.attachEvent("onload", init);
} 
else
{
               document.addEventListener("load", init, false);
}
}

//handle file selection
$(document).ready(function(){
    $("#csv-file1").change(handleFileSelect_Fees);
  });

$(document).ready(function(){
    $("#csv-file2").change(handleFileSelect_Taxes);
  });

$(document).ready(function(){
    $("#csv-file3").change(handleFileSelect_properties);
  });

function init() 
{
    var button = document.getElementById("fee_button");
        if(button.addEventListener){
                    button.addEventListener("click", function() 
                    {
                        parseData(fee_file, validate_fees);
                    }, false);
        } 
        else if(button.attachEvent)
        {
                    button.attachEvent("onclick", function() 
                    {
                        parseData(fee_file, validate_fees);
                    });
        }
            
    button = document.getElementById("tax_button");
        if(button.addEventListener){
                    button.addEventListener("click", function() 
                    {
                        parseData(tax_file, validate_taxes);
                    }, false);
                } 
        else if(button.attachEvent){
                    button.attachEvent("onclick", function() 
                    {
                        parseData(tax_file, validate_taxes);
                    });
                }
                 
    button = document.getElementById("properties_button");
        if(button.addEventListener){
                    button.addEventListener("click", function() 
                    {
                        parseData(prop_file, validate_properties);
                    }, false);
                } 
        else if(button.attachEvent){
                    button.attachEvent("onclick", function() 
                    {
                        parseData(prop_file, validate_properties);
                    });
                }
                
    button = document.getElementById("final_button");
        if(button.addEventListener){
                    button.addEventListener("click", function() 
                    {
                        run_final();
                    }, false);
                } 
        else if(button.attachEvent){
                    button.attachEvent("onclick", function() 
                    {
                        run_final();
                    });
                }
                
    button = document.getElementById("property_update");
        if(button.addEventListener){
                    button.addEventListener("click", function() 
                    {
                       display_props();
                    }, false);
                } 
        else if(button.attachEvent){
                    button.attachEvent("onclick", function() 
                    {
                        display_props();
                    });
                }
}
            
//handling file selection            
{
function handleFileSelect_Fees(evt) 
{
    fee_file = evt.target.files[0];
   
}

function handleFileSelect_Taxes(evt) 
{
    tax_file = evt.target.files[0];
   
}

function handleFileSelect_properties(evt)
{
    prop_file = evt.target.files[0];
}
}

function parseData(file_to_parse, callBack) {    
    Papa.parse(file_to_parse, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        error: function(){alert("error");},
        complete: function(results) {
            callBack(results.data);
        }
    });
}

function display_props()
{
    document.getElementById("display_properties").innerHTML = "Number of prop: "
    + prop_data.length + "\n" + prop_to_string(prop_data);
}

function run_final()
{
    var prop_map = new Map();
    
    //checking un-uploaded files
  
   {
    var check_against = undefined;
    var valid = true;
    if (prop_data === check_against)// === 0 || typeof prop_data === undefined)
    {
        alert("Please select property data");
        valid = false;
    }
    if (tax_data === check_against)
    {
        alert("Please select tax file");
        valid = false;
    }
    if (fee_data === check_against)
    {
        alert("Please select fee file");
        valid = false;
    }
    if (valid !== true)
    {
        alert("Please select missing files");
        return;
    }
}
    
    fill_map(prop_map);
   // console.log(prop_map);
    check_missing_map(prop_map);
}

function check_missing_map(map)
{
    var to_return = "";
    var min_tax = prompt("Please enter minimum number of taxes for each prop\n" 
            + "defaults to 1",1);
    if(min_tax < 0 || min_tax === undefined /*|| typeof min_tax !== num*/) 
    {
        min_tax = 0;
    }
    var min_fee = prompt("Please enter minimum number of fees for each prop \n" 
            + "defaults to 1",1);
    if(min_fee < 0 || min_fee === undefined) min_tax = 0;
    var counter = 0;
   for (var value of map.values()) 
    {
        var trigger2 = false;
        var trigger = false;
        if (value.taxes.length < min_tax)
        {
            trigger = true;
            to_return +="Name:" +  value.Property_Name + "\nID: " 
                    + value.Property_ID + "\n"; 
            to_return += "Missing taxes\n";
        }
        if (value.fees.length < min_fee)
        {
            if (trigger !== true)
            {
                to_return +="Name:" +  value.Property_Name + "\nID: " 
                    + value.Property_ID + "\n";
            }
            to_return +="Missing fees\n\n";
            trigger2 = true;
            counter++;
           
        }
        if(trigger && trigger2 === false) 
        {
            to_return += "\n";
            counter++;
        }
    }
    if (to_return === "")
    {
        to_return = "No issues";
    }
   document.getElementById("property_issues").innerHTML = 
           "Number of properties with errors: " + counter + "\n" +
            to_return;
}

function fill_map(map)
{
    

    //alert(prop_data.length);
    //console.log(prop_data);
    for (var i = 0; i < prop_data.length; i++)
    {
        var id = prop_data[i].Property_ID;
        //console.log(prop_data[i]);
        //alert(id);
        map.set(id,prop_data[i]);
    }

    map_taxes(map);
    map_fees(map);
    console.log(map);
    
}

function map_taxes(map)
{
    
    var missing_id = "";
    var counter = 0;
    for (var i = 0;i < tax_data.length; i++)
    {
        var temp_tax = tax_data[i];
        var temp_id = temp_tax.PMS_Property_ID;
        var temp_prop = map.get(temp_id);
        var check_against = undefined;
        if (temp_prop === check_against)
        {
            missing_id += "Prop id: " + temp_id + " is not found in the key\n";
            counter++;
        }
        else
        {
            temp_prop.taxes.push(temp_tax);
        }
    }
    if (missing_id !== "")
    {
        alert("Taxes missing ID's\nNumber of errors: " + counter + "\n" 
                + missing_id);
    }
}

function map_fees(map)
{
    var missing_id = "";
    var num_missing = 0;
    for (var i = 0;i < fee_data.length; i++)
    {
        var temp_fee = fee_data[i];
        var temp_id = temp_fee.PMS_Property_ID;
        var temp_prop = map.get(temp_id);
        var check_against = undefined;
        if (temp_prop === check_against)
        {
            missing_id += "Prop id: " + temp_id + " is not found in the key\n";
            num_missing++;
        }
        else
        {
            temp_prop.fees.push(temp_fee);
        }
    }
    if (missing_id !== "")
    {
        alert("Fees missing ID's\nNumber of errors: " + num_missing + "\n" 
                + missing_id);
    }
}

function validate_properties(data)
{
    //alert("success");
    remove_invalid_prop(data);
    //console.log(data);
    prop_data = data;
    document.getElementById("display_properties").innerHTML = "Number of prop: "
    + data.length + "\n" + prop_to_string(data);
}

function remove_invalid_prop(to_check)
{
    var i = to_check.length - 1;
    for (i;i >= 0; i--)
    {
        if(to_check[i].Property_Name === "" && to_check[i].Property_ID === "")
        {
            to_check.splice(i,1);
        }
        else
        {
            //alert(to_check[i].Number_of_Taxes);
            delete to_check[i].Number_of_Taxes;
            delete to_check[i].Number_of_Fees;
            to_check[i].taxes = [];
            to_check[i].fees = [];
        }
    }
}

function prop_to_string(to_string)
{
    var to_return = "";
    console.log(to_string);
    for (var i  = 0; i < to_string.length; i++)
    {
        to_return += "Property Name: " + to_string[i].Property_Name + 
                "\nProperty ID: " + to_string[i].Property_ID + 
                "\nNumber of Taxes: " + to_string[i].taxes.length + 
                "\nNumber of Fees: " + to_string[i].fees.length + "\n";
        to_return += "\n";
    }
    return to_return;
}

function validate_taxes(data)
{
    
    remove_invalid_taxes(data);
    //console.log(data);
    tax_data = data;
    var to_display = "";
    var duplicates = "";
    var running_total = {percent_total:0, percent_min:Number.MAX_SAFE_INTEGER, 
        percent_max:0, flat_total:0, flat_max:0, num_flat:0,num_per:0, 
        flat_min:Number.MAX_SAFE_INTEGER};
    
    var flat_limit = prompt("Enter upper limit for Flat Taxes");
    var per_limit = prompt("Enter upper limit for Percent Taxes",20);
    for(var i = 0; i < data.length; i++)
    {
       //check duplicates
       for (var j = i + 1; j < data.length; j++)
       {
           var temp = data[i];
           if (check_dup_tax(temp,data[j]))
           {
               
                duplicates += "Property Name: " + temp.Property_Name + " ID: "
                    + temp.PMS_Property_ID + " Tax Name: " + temp.Tax_Name + 
                    " is duplicated\n";
                break;
            
           }
       }
       
        var dummy = "";
       dummy = check_missing_tax(data[i]);
       if (dummy !== "")
       {
           to_display += dummy + "\n\n";
       }
       
        dummy = check_value_tax(data[i], flat_limit,per_limit, running_total);
        if (dummy !== "")
       {
           to_display += dummy + "\n\n";
       }
    }
       
    if (data.length > 0)
    {
        var averages = return_average(running_total);
    }
    var duplicates_display = "";
    if (to_display === "") to_display = "No errors found ";
    else to_display = "Errors:\n".bold() + to_display;
    if(duplicates === "") duplicates_display = "No duplicates found ";
    else duplicates_display = "Duplicates\n".bold() + duplicates;
   
   var display_info = errors_ToString(running_total, averages) 
           + duplicates_display + "\n" + to_display;
   
    document.getElementById("display_taxes").innerHTML = display_info;
}

function check_dup_tax(data1, data2)
{
    if(data1.PMS_Property_ID === data2.PMS_Property_ID)
    {
        if(data1.Tax_Name === data2.Tax_Name) return true;
            
    }
    return false;
}
    
function errors_ToString(running_total, averages)
{
    var display_info = "Number of flat taxes: " 
            + running_total.num_flat + "\nAverage value of flat taxes: " 
            + averages.flat.toFixed(2) + "\n" + "Max flat value: " + 
            running_total.flat_max + "\nMin flat value: " + 
            running_total.flat_min + "\nNumber of percent taxes: " + 
            running_total.num_per + "\nAverage value of percent taxes: " + 
            averages.percent.toFixed(2) + "\nMax percent value: " + 
            running_total.percent_max + "\nMin percent value: " + 
            running_total.percent_min + "\n";
    return display_info;
}

function remove_invalid_taxes(data)
{
    var i = data.length - 1;
    //alert("entering tax removal number of taxes = " + i);
    for(i; i > 0; i--)
    {
        if(valid_tax(data[i]) === false)
        {
            data.splice(i,1);
        }
        //else alert("acceptable tax");
    }
}

function valid_tax(to_check)
{
    //alert("entering valid tax");
    if (to_check["Property_Name"] === "" && to_check["PMS_Property_ID"] 
             === "")
     {
         return false;
     }
     else return true;
}

function check_missing_tax(to_check)
{
    var to_return = "";
    for (var x in to_check)
    {
        if (x !== "From_Date" && x !== "To_Date" && x !== "Comments" 
                && x !== "Tax_ID"  && x !== "" && x !== "Property_Name")
        {
            if (to_check[x] === "") to_return += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Tax_Name: "
                + to_check.Tax_Name + " is missing " 
                + x + "\n";
        }
    }
    return to_return;
}

function check_value_tax(to_check, flat_limit,per_limit, running_total)
{
    var to_alert = "";
    
    if(to_check["Flat / Percent"] === "P")
    {
        running_total.percent_total += to_check.Value;
        running_total.num_per++;
        if(running_total.percent_min > to_check.Value)
            {
                running_total.percent_min = to_check.Value;
            }
         if(running_total.percent_max < to_check.Value)
            {
                running_total.percent_max = to_check.Value;
            }   
        if (to_check.Value > per_limit ||to_check.Value <= 0) 
        {
            to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check.Tax_Name + " has a fee % of " + to_check.Value;
        }
    }
    else if (to_check["Flat / Percent"] === "F")
    {
        running_total.flat_total += to_check.Value;
        running_total.num_flat++;
        if(running_total.flat_min > to_check.Value)
        {
                running_total.flat_min = to_check.Value;
        }
        if(running_total.flat_max < to_check.Value)
        {
            running_total.flat_max = to_check.Value;
        }
        if (to_check.Value > flat_limit || to_check.Value <= 0) 
        {
            to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check.Tax_Name + " has a value of " + to_check.Value;
        }
    }
    else 
    {
        to_alert = to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check.Tax_Name 
                + " has a invalide flat/percentage identifier";
    }
    
    return to_alert;
}

function check_dup_fee(data1, data2)
{
    if (data1.PMS_Property_ID === data2.PMS_Property_ID)
    {
        if(data1.Fee_Name === data2.Fee_Name) return true;
            
    } 
    return false;
}

function validate_fees(data) 
{
 
    remove_invalid_fees(data);
   
    //console.log(data);
    
    fee_data = data;
    
    var errors = "";
    var duplicates = "";
    var flat_alert = prompt("Enter upper limit for Flat Fees");
    var per_alert = prompt("Enter upper limit for Percent Fees",20);
    var running_total = {percent_total:0, percent_min:Number.MAX_SAFE_INTEGER, 
        percent_max:0, flat_total:0, flat_max:0, num_flat:0,num_per:0, 
        flat_min:Number.MAX_SAFE_INTEGER};
    
    for (var i = 0; i < data.length; i++)
    {
       var temp = data[i];
       for (var j = i + 1; j < data.length; j++)
       {
           if (check_dup_fee(temp,data[j]))
           {
               duplicates += "Property Name: " + temp.Property_Name + " ID: "
                    + temp.PMS_Property_ID + " Tax Name: " + temp.Fee_Name + 
                    " is duplicated\n";
                    break;
           }
       }
       var dummy = "";
       dummy = check_missing_fee(temp);
       if (dummy !== "")
       {
           errors += dummy + "\n\n";
       }
       
        dummy = check_value_fee(temp,flat_alert,per_alert,running_total);
        if (dummy !== "")
       {
           errors += dummy + "\n\n";
       }
    }
    var duplicates_display = "";
    if (data.length > 0)
    {
        var averages = return_average(running_total);
    }
    if (duplicates === "") duplicates_display = "Duplicates\n".bold() 
            + "No duplicates found\n";
    else  duplicates_display = "Duplicates\n".bold() + duplicates;
    if (errors === "") errors = "Errors\n".bold() + "No errors found ";
    else errors = "Errors\n".bold() + errors;
    
    var to_display = errors_ToString(running_total, averages) + 
            duplicates_display + errors;
    
    document.getElementById("display_fees").innerHTML = to_display;
}

function return_average(running_total)
{
    var percent_average = 0;
    var flat_average = 0;
    if(running_total.num_per > 0)
        {
            percent_average = running_total.percent_total / running_total.num_per;
        }
        else
        {
            running_total.percent_max = 0;
            running_total.percent_min = 0;
        }
        if(running_total.num_flat > 0)
        {
            flat_average = running_total.flat_total / running_total.num_flat;
        }
        else 
        {
            running_total.flat_max = 0;
            running_total.flat_min = 0;
        }
        var to_return = {flat: flat_average,percent:percent_average};
        return to_return;
}

function valid_fee(to_check)
  {
     if (to_check["Property_Name"] === "" && to_check["PMS_Property_ID"] 
             === "")
     {
         return false;
     }
     else return true;
  }

function remove_invalid_fees(data)
{
    var i = data.length - 1;
    
    for (i; i > 0; i--)
    {
        if(valid_fee(data[i]) === false)
        {
            data.splice(i,1);
        }
       
    }
  
}

function check_missing_fee(to_check)
{
    var to_alert = "";
    for (var x in to_check)
    {
        
        if (x !== "From_Date" && x !== "To_Date" && x !== "Comments" 
                && x !== "Fee_ID"  && x !== "" && x !== "Property_Name")
        {
            if (to_check[x] === "") to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check["Fee_Name"] + " is missing " 
                + x + "\n";
        }
        

}

return to_alert;
}

function check_value_fee(to_check,flat_alert,per_alert,running_total)
{
    /*var running_total = {percent_total:0, percent_min:Number.MAX_SAFE_INTEGER, 
        percent_max:0, flat_total:0, flat_max:0, num_flat:0,num_per:0, 
        flat_min:Number.MAX_SAFE_INTEGER};*/
    var to_alert = "";
    if(to_check["Flat / Percent"] === "P")
    {
        running_total.num_per++;
        running_total.percent_total += to_check.Value;
        if (running_total.percent_min > to_check.Value)
        {
            running_total.percent_min = to_check.Value;
        }
        if (running_total.percent_max < to_check.Value)
        {
            running_total.percent_max = to_check.Value;
        }
        if (to_check.Value > per_alert ||to_check.Value <= 0) 
        {
            to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check["Fee_Name"] + " has a fee % of " + to_check.Value;
        }
    }
    else if (to_check["Flat / Percent"] === "F")
    {
        running_total.num_flat++;
        running_total.flat_total += to_check.Value;
        if (running_total.flat_min > to_check.Value)
        {
            running_total.flat_min = to_check.Value;
        }
        if (running_total.flat_max < to_check.Value)
        {
            running_total.flat_max = to_check.Value;
        }
        if (to_check.Value > flat_alert || to_check.Value <= 0) 
        {
            to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check["Fee_Name"] + " has a value of " + to_check.Value;
        }
    }
    else 
    {
        console.log(to_check);
        to_alert = to_alert += "Property Name: " + 
                to_check["Property_Name"] + ", Property ID:"  
                + to_check["PMS_Property_ID"] + ", Fee Name: "
                + to_check["Fee_Name"] 
                + " has an invalid flat/percentage identifier";
    }
    
    //if (to_alert !== "") alert(to_alert);
    return to_alert;
}

