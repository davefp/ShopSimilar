import httplib
import mimetools
import mimetypes

ENCODE_TEMPLATE= """--%(boundary)s
Content-Disposition: form-data; name="%(name)s"

%(value)s
""".replace('\n','\r\n')

ENCODE_TEMPLATE_FILE = """--%(boundary)s
Content-Disposition: form-data; name="%(name)s"; filename="%(filename)s"
Content-Type: %(contenttype)s

%(value)s
""".replace('\n','\r\n')

def encode_multipart_formdata(fields, files, boundary=None, mime_type=None):
    """
    fields is a dictionary of elements for regular form fields.
    files is a sequence of (name, filename, value) elements for data to be uploaded as files

    boundary is a random string used to separate the sections of the post request.
    Return (content_type, body) ready for httplib.HTTP instance
    """

    if boundary is None:
        BOUNDARY = mimetools.choose_boundary()
    else:
        BOUNDARY = boundary

    body = ""
    for (key, value) in fields.iteritems():
        body += ENCODE_TEMPLATE % {'boundary': BOUNDARY, 'name': str(key), 'value': str(value)}

    for (key, filename, value) in files:
        if mime_type is None or mime_type.lower() == 'unknown':
            mime_type = str(get_content_type(filename))

        # Note that 'filename' is converted to a string explicitly because otherwise if it is a unicode value it changes "body" to be unicode, which in turn
        # means that 'value' which is a byte string tries to convert itself to unicode and explodes.
        body += ENCODE_TEMPLATE_FILE % {'boundary': BOUNDARY, 'name': str(key), 'value': str(value), 'filename': str(filename), 'contenttype': mime_type}

    body += '--' + BOUNDARY + '--'

    content_type = 'multipart/form-data; boundary=%s' % BOUNDARY
    return content_type, body

def get_content_type(filename):
    return mimetypes.guess_type(filename)[0] or 'application/octet-stream'

