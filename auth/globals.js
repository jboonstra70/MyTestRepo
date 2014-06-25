/**
 * @properties={typeid:24,uuid:"F1D7A1FC-2AAD-46AF-8D0F-A58D80ADC4A5"}
 */
function authenticate(user, pass) {
	var userUID = security.getUserUID(user);
	if (userUID && security.checkPassword(userUID, pass)) {
		var groups = security.getUserGroups(userUID).getColumnAsArray(2);
		return security.login(user,userUID,groups);
	}
	return false;
}
