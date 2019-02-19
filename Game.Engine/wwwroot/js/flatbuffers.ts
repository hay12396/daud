/// @file
/// @addtogroup flatbuffers_javascript_api
/// @{
/// @cond FLATBUFFERS_INTERNAL

/**
 * @fileoverview
 *
 * Need to suppress 'global this' error so the Node.js export line doesn't cause
 * closure compile to error out.
 * @suppress {globalThis}
 */

/**
 * @const
 * @namespace
 */
var flatbuffers = {};

/**
 * @typedef {number}
 */
(<any>flatbuffers).Offset;

/**
 * @typedef {{
 *   bb: (<any>flatbuffers).ByteBuffer,
 *   bb_pos: number
 * }}
 */
(<any>flatbuffers).Table;

/**
 * @type {number}
 * @const
 */
(<any>flatbuffers).SIZEOF_SHORT = 2;

/**
 * @type {number}
 * @const
 */
(<any>flatbuffers).SIZEOF_INT = 4;

/**
 * @type {number}
 * @const
 */
(<any>flatbuffers).FILE_IDENTIFIER_LENGTH = 4;

/**
 * @enum {number}
 */
(<any>flatbuffers).Encoding = {
    UTF8_BYTES: 1,
    UTF16_STRING: 2
};

/**
 * @type {Int32Array}
 * @const
 */
(<any>flatbuffers).int32 = new Int32Array(2);

/**
 * @type {Float32Array}
 * @const
 */
(<any>flatbuffers).float32 = new Float32Array((<any>flatbuffers).int32.buffer);

/**
 * @type {Float64Array}
 * @const
 */
(<any>flatbuffers).float64 = new Float64Array((<any>flatbuffers).int32.buffer);

/**
 * @type {boolean}
 * @const
 */
(<any>flatbuffers).isLittleEndian = new Uint16Array(new Uint8Array([1, 0]).buffer)[0] === 1;

////////////////////////////////////////////////////////////////////////////////

/**
 * @constructor
 * @param {number} low
 * @param {number} high
 */
(<any>flatbuffers).Long = function(low, high) {
    /**
     * @type {number}
     * @const
     */
    this.low = low | 0;

    /**
     * @type {number}
     * @const
     */
    this.high = high | 0;
};

/**
 * @param {number} low
 * @param {number} high
 * @returns {(<any>flatbuffers).Long}
 */
(<any>flatbuffers).Long.create = (
    low,
    high // Special-case zero to avoid GC overhead for default values
) => (low == 0 && high == 0 ? (<any>flatbuffers).Long.ZERO : new (<any>flatbuffers).Long(low, high));

/**
 * @returns {number}
 */
(<any>flatbuffers).Long.prototype.toFloat64 = function() {
    return (this.low >>> 0) + this.high * 0x100000000;
};

/**
 * @param {(<any>flatbuffers).Long} other
 * @returns {boolean}
 */
(<any>flatbuffers).Long.prototype.equals = function({ low, high }) {
    return this.low == low && this.high == high;
};

/**
 * @type {(<any>flatbuffers).Long}
 * @const
 */
(<any>flatbuffers).Long.ZERO = new (<any>flatbuffers).Long(0, 0);

/// @endcond
////////////////////////////////////////////////////////////////////////////////
/**
 * Create a FlatBufferBuilder.
 *
 * @constructor
 * @param {number=} opt_initial_size
 */
(<any>flatbuffers).Builder = function(opt_initial_size: number) {
    if (!opt_initial_size) {
        var initial_size = 1024;
    } else {
        var initial_size = opt_initial_size;
    }

    /**
     * @type {(<any>flatbuffers).ByteBuffer}
     * @private
     */
    this.bb = (<any>flatbuffers).ByteBuffer.allocate(initial_size);

    /**
     * Remaining space in the ByteBuffer.
     *
     * @type {number}
     * @private
     */
    this.space = initial_size;

    /**
     * Minimum alignment encountered so far.
     *
     * @type {number}
     * @private
     */
    this.minalign = 1;

    /**
     * The vtable for the current table.
     *
     * @type {Array.<number>}
     * @private
     */
    this.vtable = null;

    /**
     * The amount of fields we're actually using.
     *
     * @type {number}
     * @private
     */
    this.vtable_in_use = 0;

    /**
     * Whether we are currently serializing a table.
     *
     * @type {boolean}
     * @private
     */
    this.isNested = false;

    /**
     * Starting offset of the current struct/table.
     *
     * @type {number}
     * @private
     */
    this.object_start = 0;

    /**
     * List of offsets of all vtables.
     *
     * @type {Array.<number>}
     * @private
     */
    this.vtables = [];

    /**
     * For the current vector being built.
     *
     * @type {number}
     * @private
     */
    this.vector_num_elems = 0;

    /**
     * False omits default values from the serialized data
     *
     * @type {boolean}
     * @private
     */
    this.force_defaults = false;
};

/**
 * In order to save space, fields that are set to their default value
 * don't get serialized into the buffer. Forcing defaults provides a
 * way to manually disable this optimization.
 *
 * @param {boolean} forceDefaults true always serializes default values
 */
(<any>flatbuffers).Builder.prototype.forceDefaults = function(forceDefaults) {
    this.force_defaults = forceDefaults;
};

/**
 * Get the ByteBuffer representing the FlatBuffer. Only call this after you've
 * called finish(). The actual data starts at the ByteBuffer's current position,
 * not necessarily at 0.
 *
 * @returns {(<any>flatbuffers).ByteBuffer}
 */
(<any>flatbuffers).Builder.prototype.dataBuffer = function() {
    return this.bb;
};

/**
 * Get the bytes representing the FlatBuffer. Only call this after you've
 * called finish().
 *
 * @returns {Uint8Array}
 */
(<any>flatbuffers).Builder.prototype.asUint8Array = function() {
    return this.bb.bytes().subarray(this.bb.position(), this.bb.position() + this.offset());
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * Prepare to write an element of `size` after `additional_bytes` have been
 * written, e.g. if you write a string, you need to align such the int length
 * field is aligned to 4 bytes, and the string data follows it directly. If all
 * you need to do is alignment, `additional_bytes` will be 0.
 *
 * @param {number} size This is the of the new element to write
 * @param {number} additional_bytes The padding size
 */
(<any>flatbuffers).Builder.prototype.prep = function(size, additional_bytes) {
    // Track the biggest thing we've ever aligned to.
    if (size > this.minalign) {
        this.minalign = size;
    }

    // Find the amount of alignment needed such that `size` is properly
    // aligned after `additional_bytes`
    const align_size = (~(this.bb.capacity() - this.space + additional_bytes) + 1) & (size - 1);

    // Reallocate the buffer if needed.
    while (this.space < align_size + size + additional_bytes) {
        const old_buf_size = this.bb.capacity();
        this.bb = (<any>flatbuffers).Builder.growByteBuffer(this.bb);
        this.space += this.bb.capacity() - old_buf_size;
    }

    this.pad(align_size);
};

/**
 * @param {number} byte_size
 */
(<any>flatbuffers).Builder.prototype.pad = function(byte_size) {
    for (let i = 0; i < byte_size; i++) {
        this.bb.writeInt8(--this.space, 0);
    }
};

/**
 * @param {number} value
 */
(<any>flatbuffers).Builder.prototype.writeInt8 = function(value) {
    this.bb.writeInt8((this.space -= 1), value);
};

/**
 * @param {number} value
 */
(<any>flatbuffers).Builder.prototype.writeInt16 = function(value) {
    this.bb.writeInt16((this.space -= 2), value);
};

/**
 * @param {number} value
 */
(<any>flatbuffers).Builder.prototype.writeInt32 = function(value) {
    this.bb.writeInt32((this.space -= 4), value);
};

/**
 * @param {(<any>flatbuffers).Long} value
 */
(<any>flatbuffers).Builder.prototype.writeInt64 = function(value) {
    this.bb.writeInt64((this.space -= 8), value);
};

/**
 * @param {number} value
 */
(<any>flatbuffers).Builder.prototype.writeFloat32 = function(value) {
    this.bb.writeFloat32((this.space -= 4), value);
};

/**
 * @param {number} value
 */
(<any>flatbuffers).Builder.prototype.writeFloat64 = function(value) {
    this.bb.writeFloat64((this.space -= 8), value);
};
/// @endcond

/**
 * Add an `int8` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int8` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addInt8 = function(value) {
    this.prep(1, 0);
    this.writeInt8(value);
};

/**
 * Add an `int16` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int16` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addInt16 = function(value) {
    this.prep(2, 0);
    this.writeInt16(value);
};

/**
 * Add an `int32` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `int32` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addInt32 = function(value) {
    this.prep(4, 0);
    this.writeInt32(value);
};

/**
 * Add an `int64` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {(<any>flatbuffers).Long} value The `int64` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addInt64 = function(value) {
    this.prep(8, 0);
    this.writeInt64(value);
};

/**
 * Add a `float32` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `float32` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addFloat32 = function(value) {
    this.prep(4, 0);
    this.writeFloat32(value);
};

/**
 * Add a `float64` to the buffer, properly aligned, and grows the buffer (if necessary).
 * @param {number} value The `float64` to add the the buffer.
 */
(<any>flatbuffers).Builder.prototype.addFloat64 = function(value) {
    this.prep(8, 0);
    this.writeFloat64(value);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldInt8 = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addInt8(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldInt16 = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addInt16(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldInt32 = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addInt32(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {(<any>flatbuffers).Long} value
 * @param {(<any>flatbuffers).Long} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldInt64 = function(voffset, value, defaultValue) {
    if (this.force_defaults || !value.equals(defaultValue)) {
        this.addInt64(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldFloat32 = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addFloat32(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {number} value
 * @param {number} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldFloat64 = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addFloat64(value);
        this.slot(voffset);
    }
};

/**
 * @param {number} voffset
 * @param {(<any>flatbuffers).Offset} value
 * @param {(<any>flatbuffers).Offset} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldOffset = function(voffset, value, defaultValue) {
    if (this.force_defaults || value != defaultValue) {
        this.addOffset(value);
        this.slot(voffset);
    }
};

/**
 * Structs are stored inline, so nothing additional is being added. `d` is always 0.
 *
 * @param {number} voffset
 * @param {(<any>flatbuffers).Offset} value
 * @param {(<any>flatbuffers).Offset} defaultValue
 */
(<any>flatbuffers).Builder.prototype.addFieldStruct = function(voffset, value, defaultValue) {
    if (value != defaultValue) {
        this.nested(value);
        this.slot(voffset);
    }
};

/**
 * Structures are always stored inline, they need to be created right
 * where they're used.  You'll get this assertion failure if you
 * created it elsewhere.
 *
 * @param {(<any>flatbuffers).Offset} obj The offset of the created object
 */
(<any>flatbuffers).Builder.prototype.nested = function(obj) {
    if (obj != this.offset()) {
        throw new Error("FlatBuffers: struct must be serialized inline.");
    }
};

/**
 * Should not be creating any other object, string or vector
 * while an object is being constructed
 */
(<any>flatbuffers).Builder.prototype.notNested = function() {
    if (this.isNested) {
        throw new Error("FlatBuffers: object serialization must not be nested.");
    }
};

/**
 * Set the current vtable at `voffset` to the current location in the buffer.
 *
 * @param {number} voffset
 */
(<any>flatbuffers).Builder.prototype.slot = function(voffset) {
    this.vtable[voffset] = this.offset();
};

/**
 * @returns {(<any>flatbuffers).Offset} Offset relative to the end of the buffer.
 */
(<any>flatbuffers).Builder.prototype.offset = function() {
    return this.bb.capacity() - this.space;
};

/**
 * Doubles the size of the backing ByteBuffer and copies the old data towards
 * the end of the new buffer (since we build the buffer backwards).
 *
 * @param {(<any>flatbuffers).ByteBuffer} bb The current buffer with the existing data
 * @returns {(<any>flatbuffers).ByteBuffer} A new byte buffer with the old data copied
 * to it. The data is located at the end of the buffer.
 *
 * uint8Array.set() formally takes {Array<number>|ArrayBufferView}, so to pass
 * it a uint8Array we need to suppress the type check:
 * @suppress {checkTypes}
 */
(<any>flatbuffers).Builder.growByteBuffer = bb => {
    const old_buf_size = bb.capacity();

    // Ensure we don't grow beyond what fits in an int.
    if (old_buf_size & 0xc0000000) {
        throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");
    }

    const new_buf_size = old_buf_size << 1;
    const nbb = (<any>flatbuffers).ByteBuffer.allocate(new_buf_size);
    nbb.setPosition(new_buf_size - old_buf_size);
    nbb.bytes().set(bb.bytes(), new_buf_size - old_buf_size);
    return nbb;
};
/// @endcond

/**
 * Adds on offset, relative to where it will be written.
 *
 * @param {(<any>flatbuffers).Offset} offset The offset to add.
 */
(<any>flatbuffers).Builder.prototype.addOffset = function(offset) {
    this.prep((<any>flatbuffers).SIZEOF_INT, 0); // Ensure alignment is already done.
    this.writeInt32(this.offset() - offset + (<any>flatbuffers).SIZEOF_INT);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * Start encoding a new object in the buffer.  Users will not usually need to
 * call this directly. The FlatBuffers compiler will generate helper methods
 * that call this method internally.
 *
 * @param {number} numfields
 */
(<any>flatbuffers).Builder.prototype.startObject = function(numfields) {
    this.notNested();
    if (this.vtable == null) {
        this.vtable = [];
    }
    this.vtable_in_use = numfields;
    for (let i = 0; i < numfields; i++) {
        this.vtable[i] = 0; // This will push additional elements as needed
    }
    this.isNested = true;
    this.object_start = this.offset();
};

/**
 * Finish off writing the object that is under construction.
 *
 * @returns {(<any>flatbuffers).Offset} The offset to the object inside `dataBuffer`
 */
(<any>flatbuffers).Builder.prototype.endObject = function() {
    if (this.vtable == null || !this.isNested) {
        throw new Error("FlatBuffers: endObject called without startObject");
    }

    this.addInt32(0);
    const vtableloc = this.offset();

    // Trim trailing zeroes.
    let i = this.vtable_in_use - 1;
    for (; i >= 0 && this.vtable[i] == 0; i--) {}
    const trimmed_size = i + 1;

    // Write out the current vtable.
    for (; i >= 0; i--) {
        // Offset relative to the start of the table.
        this.addInt16(this.vtable[i] != 0 ? vtableloc - this.vtable[i] : 0);
    }

    const standard_fields = 2; // The fields below:
    this.addInt16(vtableloc - this.object_start);
    const len = (trimmed_size + standard_fields) * (<any>flatbuffers).SIZEOF_SHORT;
    this.addInt16(len);

    // Search for an existing vtable that matches the current one.
    let existing_vtable = 0;
    const vt1 = this.space;
    outer_loop: for (i = 0; i < this.vtables.length; i++) {
        const vt2 = this.bb.capacity() - this.vtables[i];
        if (len == this.bb.readInt16(vt2)) {
            for (let j = (<any>flatbuffers).SIZEOF_SHORT; j < len; j += (<any>flatbuffers).SIZEOF_SHORT) {
                if (this.bb.readInt16(vt1 + j) != this.bb.readInt16(vt2 + j)) {
                    continue outer_loop;
                }
            }
            existing_vtable = this.vtables[i];
            break;
        }
    }

    if (existing_vtable) {
        // Found a match:
        // Remove the current vtable.
        this.space = this.bb.capacity() - vtableloc;

        // Point table to existing vtable.
        this.bb.writeInt32(this.space, existing_vtable - vtableloc);
    } else {
        // No match:
        // Add the location of the current vtable to the list of vtables.
        this.vtables.push(this.offset());

        // Point table to current vtable.
        this.bb.writeInt32(this.bb.capacity() - vtableloc, this.offset() - vtableloc);
    }

    this.isNested = false;
    return vtableloc;
};
/// @endcond

/**
 * Finalize a buffer, poiting to the given `root_table`.
 *
 * @param {(<any>flatbuffers).Offset} root_table
 * @param {string=} opt_file_identifier
 */
(<any>flatbuffers).Builder.prototype.finish = function(root_table, opt_file_identifier) {
    if (opt_file_identifier) {
        const file_identifier = opt_file_identifier;
        this.prep(this.minalign, (<any>flatbuffers).SIZEOF_INT + (<any>flatbuffers).FILE_IDENTIFIER_LENGTH);
        if (file_identifier.length != (<any>flatbuffers).FILE_IDENTIFIER_LENGTH) {
            throw new Error(`FlatBuffers: file identifier must be length ${(<any>flatbuffers).FILE_IDENTIFIER_LENGTH}`);
        }
        for (let i = (<any>flatbuffers).FILE_IDENTIFIER_LENGTH - 1; i >= 0; i--) {
            this.writeInt8(file_identifier.charCodeAt(i));
        }
    }
    this.prep(this.minalign, (<any>flatbuffers).SIZEOF_INT);
    this.addOffset(root_table);
    this.bb.setPosition(this.space);
};

/// @cond FLATBUFFERS_INTERNAL
/**
 * This checks a required field has been set in a given table that has
 * just been constructed.
 *
 * @param {(<any>flatbuffers).Offset} table
 * @param {number} field
 */
(<any>flatbuffers).Builder.prototype.requiredField = function(table, field) {
    const table_start = this.bb.capacity() - table;
    const vtable_start = table_start - this.bb.readInt32(table_start);
    const ok = this.bb.readInt16(vtable_start + field) != 0;

    // If this fails, the caller will show what field needs to be set.
    if (!ok) {
        throw new Error(`FlatBuffers: field ${field} must be set`);
    }
};

/**
 * Start a new array/vector of objects.  Users usually will not call
 * this directly. The FlatBuffers compiler will create a start/end
 * method for vector types in generated code.
 *
 * @param {number} elem_size The size of each element in the array
 * @param {number} num_elems The number of elements in the array
 * @param {number} alignment The alignment of the array
 */
(<any>flatbuffers).Builder.prototype.startVector = function(elem_size, num_elems, alignment) {
    this.notNested();
    this.vector_num_elems = num_elems;
    this.prep((<any>flatbuffers).SIZEOF_INT, elem_size * num_elems);
    this.prep(alignment, elem_size * num_elems); // Just in case alignment > int.
};

/**
 * Finish off the creation of an array and all its elements. The array must be
 * created with `startVector`.
 *
 * @returns {(<any>flatbuffers).Offset} The offset at which the newly created array
 * starts.
 */
(<any>flatbuffers).Builder.prototype.endVector = function() {
    this.writeInt32(this.vector_num_elems);
    return this.offset();
};
/// @endcond

/**
 * Encode the string `s` in the buffer using UTF-8. If a Uint8Array is passed
 * instead of a string, it is assumed to contain valid UTF-8 encoded data.
 *
 * @param {string|Uint8Array} s The string to encode
 * @return {(<any>flatbuffers).Offset} The offset in the buffer where the encoded string starts
 */
(<any>flatbuffers).Builder.prototype.createString = function(s) {
    var utf8: Uint8Array | any[];
    if (s instanceof Uint8Array) {
        utf8 = s;
    } else {
        utf8 = [];
        var i = 0;

        while (i < s.length) {
            let codePoint;

            // Decode UTF-16
            const a = s.charCodeAt(i++);
            if (a < 0xd800 || a >= 0xdc00) {
                codePoint = a;
            } else {
                const b = s.charCodeAt(i++);
                codePoint = (a << 10) + b + (0x10000 - (0xd800 << 10) - 0xdc00);
            }

            // Encode UTF-8
            if (codePoint < 0x80) {
                utf8.push(codePoint);
            } else {
                if (codePoint < 0x800) {
                    utf8.push(((codePoint >> 6) & 0x1f) | 0xc0);
                } else {
                    if (codePoint < 0x10000) {
                        utf8.push(((codePoint >> 12) & 0x0f) | 0xe0);
                    } else {
                        utf8.push(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80);
                    }
                    utf8.push(((codePoint >> 6) & 0x3f) | 0x80);
                }
                utf8.push((codePoint & 0x3f) | 0x80);
            }
        }
    }

    this.addInt8(0);
    this.startVector(1, utf8.length, 1);
    this.bb.setPosition((this.space -= utf8.length));
    for (let i = 0, offset = this.space, bytes = this.bb.bytes(); i < utf8.length; i++) {
        bytes[offset++] = utf8[i];
    }
    return this.endVector();
};

/**
 * A helper function to avoid generated code depending on this file directly.
 *
 * @param {number} low
 * @param {number} high
 * @returns {(<any>flatbuffers).Long}
 */
(<any>flatbuffers).Builder.prototype.createLong = (low, high) => (<any>flatbuffers).Long.create(low, high);
////////////////////////////////////////////////////////////////////////////////
/// @cond FLATBUFFERS_INTERNAL
/**
 * Create a new ByteBuffer with a given array of bytes (`Uint8Array`).
 *
 * @constructor
 * @param {Uint8Array} bytes
 */
(<any>flatbuffers).ByteBuffer = function(bytes) {
    /**
     * @type {Uint8Array}
     * @private
     */
    this.bytes_ = bytes;

    /**
     * @type {number}
     * @private
     */
    this.position_ = 0;
};

/**
 * Create and allocate a new ByteBuffer with a given size.
 *
 * @param {number} byte_size
 * @returns {(<any>flatbuffers).ByteBuffer}
 */
(<any>flatbuffers).ByteBuffer.allocate = byte_size => new (<any>flatbuffers).ByteBuffer(new Uint8Array(byte_size));

/**
 * Get the underlying `Uint8Array`.
 *
 * @returns {Uint8Array}
 */
(<any>flatbuffers).ByteBuffer.prototype.bytes = function() {
    return this.bytes_;
};

/**
 * Get the buffer's position.
 *
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.position = function() {
    return this.position_;
};

/**
 * Set the buffer's position.
 *
 * @param {number} position
 */
(<any>flatbuffers).ByteBuffer.prototype.setPosition = function(position) {
    this.position_ = position;
};

/**
 * Get the buffer's capacity.
 *
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.capacity = function() {
    return this.bytes_.length;
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readInt8 = function(offset) {
    return (this.readUint8(offset) << 24) >> 24;
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readUint8 = function(offset) {
    return this.bytes_[offset];
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readInt16 = function(offset) {
    return (this.readUint16(offset) << 16) >> 16;
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readUint16 = function(offset) {
    return this.bytes_[offset] | (this.bytes_[offset + 1] << 8);
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readInt32 = function(offset) {
    return this.bytes_[offset] | (this.bytes_[offset + 1] << 8) | (this.bytes_[offset + 2] << 16) | (this.bytes_[offset + 3] << 24);
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readUint32 = function(offset) {
    return this.readInt32(offset) >>> 0;
};

/**
 * @param {number} offset
 * @returns {(<any>flatbuffers).Long}
 */
(<any>flatbuffers).ByteBuffer.prototype.readInt64 = function(offset) {
    return new (<any>flatbuffers).Long(this.readInt32(offset), this.readInt32(offset + 4));
};

/**
 * @param {number} offset
 * @returns {(<any>flatbuffers).Long}
 */
(<any>flatbuffers).ByteBuffer.prototype.readUint64 = function(offset) {
    return new (<any>flatbuffers).Long(this.readUint32(offset), this.readUint32(offset + 4));
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readFloat32 = function(offset) {
    (<any>flatbuffers).int32[0] = this.readInt32(offset);
    return (<any>flatbuffers).float32[0];
};

/**
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.readFloat64 = function(offset) {
    (<any>flatbuffers).int32[(<any>flatbuffers).isLittleEndian ? 0 : 1] = this.readInt32(offset);
    (<any>flatbuffers).int32[(<any>flatbuffers).isLittleEndian ? 1 : 0] = this.readInt32(offset + 4);
    return (<any>flatbuffers).float64[0];
};

/**
 * @param {number} offset
 * @param {number|boolean} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeInt8 = function(offset, value) {
    this.bytes_[offset] = /** @type {number} */ (value);
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeUint8 = function(offset, value) {
    this.bytes_[offset] = value;
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeInt16 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeUint16 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeInt32 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeUint32 = function(offset, value) {
    this.bytes_[offset] = value;
    this.bytes_[offset + 1] = value >> 8;
    this.bytes_[offset + 2] = value >> 16;
    this.bytes_[offset + 3] = value >> 24;
};

/**
 * @param {number} offset
 * @param {(<any>flatbuffers).Long} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeInt64 = function(offset, { low, high }) {
    this.writeInt32(offset, low);
    this.writeInt32(offset + 4, high);
};

/**
 * @param {number} offset
 * @param {(<any>flatbuffers).Long} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeUint64 = function(offset, { low, high }) {
    this.writeUint32(offset, low);
    this.writeUint32(offset + 4, high);
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeFloat32 = function(offset, value) {
    (<any>flatbuffers).float32[0] = value;
    this.writeInt32(offset, (<any>flatbuffers).int32[0]);
};

/**
 * @param {number} offset
 * @param {number} value
 */
(<any>flatbuffers).ByteBuffer.prototype.writeFloat64 = function(offset, value) {
    (<any>flatbuffers).float64[0] = value;
    this.writeInt32(offset, (<any>flatbuffers).int32[(<any>flatbuffers).isLittleEndian ? 0 : 1]);
    this.writeInt32(offset + 4, (<any>flatbuffers).int32[(<any>flatbuffers).isLittleEndian ? 1 : 0]);
};

/**
 * Return the file identifier.   Behavior is undefined for FlatBuffers whose
 * schema does not include a file_identifier (likely points at padding or the
 * start of a the root vtable).
 * @returns {string}
 */
(<any>flatbuffers).ByteBuffer.prototype.getBufferIdentifier = function() {
    if (this.bytes_.length < this.position_ + (<any>flatbuffers).SIZEOF_INT + (<any>flatbuffers).FILE_IDENTIFIER_LENGTH) {
        throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");
    }
    let result = "";
    for (let i = 0; i < (<any>flatbuffers).FILE_IDENTIFIER_LENGTH; i++) {
        result += String.fromCharCode(this.readInt8(this.position_ + (<any>flatbuffers).SIZEOF_INT + i));
    }
    return result;
};

/**
 * Look up a field in the vtable, return an offset into the object, or 0 if the
 * field is not present.
 *
 * @param {number} bb_pos
 * @param {number} vtable_offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.__offset = function(bb_pos, vtable_offset) {
    const vtable = bb_pos - this.readInt32(bb_pos);
    return vtable_offset < this.readInt16(vtable) ? this.readInt16(vtable + vtable_offset) : 0;
};

/**
 * Initialize any Table-derived type to point to the union at the given offset.
 *
 * @param {(<any>flatbuffers).Table} t
 * @param {number} offset
 * @returns {(<any>flatbuffers).Table}
 */
(<any>flatbuffers).ByteBuffer.prototype.__union = function(t, offset) {
    t.bb_pos = offset + this.readInt32(offset);
    t.bb = this;
    return t;
};

/**
 * Create a JavaScript string from UTF-8 data stored inside the FlatBuffer.
 * This allocates a new string and converts to wide chars upon each access.
 *
 * To avoid the conversion to UTF-16, pass (<any>flatbuffers).Encoding.UTF8_BYTES as
 * the "optionalEncoding" argument. This is useful for avoiding conversion to
 * and from UTF-16 when the data will just be packaged back up in another
 * FlatBuffer later on.
 *
 * @param {number} offset
 * @param {(<any>flatbuffers).Encoding=} opt_encoding Defaults to UTF16_STRING
 * @returns {string|Uint8Array}
 */
(<any>flatbuffers).ByteBuffer.prototype.__string = function(offset, opt_encoding) {
    offset += this.readInt32(offset);

    const length = this.readInt32(offset);
    let result = "";
    let i = 0;

    offset += (<any>flatbuffers).SIZEOF_INT;

    if (opt_encoding === (<any>flatbuffers).Encoding.UTF8_BYTES) {
        return this.bytes_.subarray(offset, offset + length);
    }

    while (i < length) {
        let codePoint;

        // Decode UTF-8
        const a = this.readUint8(offset + i++);
        if (a < 0xc0) {
            codePoint = a;
        } else {
            const b = this.readUint8(offset + i++);
            if (a < 0xe0) {
                codePoint = ((a & 0x1f) << 6) | (b & 0x3f);
            } else {
                const c = this.readUint8(offset + i++);
                if (a < 0xf0) {
                    codePoint = ((a & 0x0f) << 12) | ((b & 0x3f) << 6) | (c & 0x3f);
                } else {
                    const d = this.readUint8(offset + i++);
                    codePoint = ((a & 0x07) << 18) | ((b & 0x3f) << 12) | ((c & 0x3f) << 6) | (d & 0x3f);
                }
            }
        }

        // Encode UTF-16
        if (codePoint < 0x10000) {
            result += String.fromCharCode(codePoint);
        } else {
            codePoint -= 0x10000;
            result += String.fromCharCode((codePoint >> 10) + 0xd800, (codePoint & ((1 << 10) - 1)) + 0xdc00);
        }
    }

    return result;
};

/**
 * Retrieve the relative offset stored at "offset"
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.__indirect = function(offset) {
    return offset + this.readInt32(offset);
};

/**
 * Get the start of data of a vector whose offset is stored at "offset" in this object.
 *
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.__vector = function(offset) {
    return offset + this.readInt32(offset) + (<any>flatbuffers).SIZEOF_INT; // data starts after the length
};

/**
 * Get the length of a vector whose offset is stored at "offset" in this object.
 *
 * @param {number} offset
 * @returns {number}
 */
(<any>flatbuffers).ByteBuffer.prototype.__vector_len = function(offset) {
    return this.readInt32(offset + this.readInt32(offset));
};

/**
 * @param {string} ident
 * @returns {boolean}
 */
(<any>flatbuffers).ByteBuffer.prototype.__has_identifier = function(ident) {
    if (ident.length != (<any>flatbuffers).FILE_IDENTIFIER_LENGTH) {
        throw new Error(`FlatBuffers: file identifier must be length ${(<any>flatbuffers).FILE_IDENTIFIER_LENGTH}`);
    }
    for (let i = 0; i < (<any>flatbuffers).FILE_IDENTIFIER_LENGTH; i++) {
        if (ident.charCodeAt(i) != this.readInt8(this.position_ + (<any>flatbuffers).SIZEOF_INT + i)) {
            return false;
        }
    }
    return true;
};

/**
 * A helper function to avoid generated code depending on this file directly.
 *
 * @param {number} low
 * @param {number} high
 * @returns {(<any>flatbuffers).Long}
 */
(<any>flatbuffers).ByteBuffer.prototype.createLong = (low, high) => (<any>flatbuffers).Long.create(low, high);

// Exports for Node.js and RequireJS

/// @endcond
/// @}

export { flatbuffers };
