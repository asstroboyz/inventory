export function zeroFillFromNumber( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}


export function zeroFillFromString( str, width )
{
  width -= str.length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( str ) ? 2 : 1) ).join( '0' ) + str;
  }
  return str + ""; // always return a string
}
