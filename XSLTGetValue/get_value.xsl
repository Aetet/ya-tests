<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="params/*">
  <xsl:for-each select="param[@name='url']">
    <xsl:value-of select="@value"/>
  </xsl:for-each>
</xsl:template>

</xsl:stylesheet>
